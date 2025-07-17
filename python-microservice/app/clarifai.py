from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2
import requests
import base64
import logging

logger = logging.getLogger(__name__)

async def detect_clothing_type(image_bytes: bytes):
    try:
        # Токен доступа
        PAT = "c538572ae2864a8680dd2583ff63e5e1"
        USER_ID = "clarifai"
        APP_ID = "main"
        MODEL_ID = "apparel-detection"
        MODEL_VERSION_ID = "1ed35c3d176f45d69d2aa7971e6ab9fe"

        base64_image = base64.b64encode(image_bytes).decode("utf-8")

        url = f"https://api.clarifai.com/v2/models/{MODEL_ID}/versions/{MODEL_VERSION_ID}/outputs"

        headers = {
            "Authorization": f"Key {PAT}",
            "Content-Type": "application/json"
        }

        data = {
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "base64": base64_image
                        }
                    }
                }
            ]
        }

        response = requests.post(url, headers=headers, json=data)
        result = response.json()

        # Проверка успешности запроса
        if response.status_code != 200 or result["status"]["code"] != 10000:
            return {"error": result["status"]["description"]}

        # Получаем все концепты из всех регионов
        concepts = []
        for output in result.get("outputs", []):
            for region in output.get("data", {}).get("regions", []):
                concepts.extend(region.get("data", {}).get("concepts", []))

        # Если концепты найдены, выбираем лучший
        if concepts:
            best_concept = max(concepts, key=lambda c: c["value"])

            return {
                "type": best_concept["name"],
                "confidence": best_concept["value"],
                "all_concepts": {c["name"]: c["value"] for c in concepts[:3]}  # Топ 3 концепта
            }
        else:
            return {"error": "No concepts found in the response"}

    except Exception as e:
        import traceback
        logger.error(f"Detection failed: {str(e)}\n{traceback.format_exc()}")
        return {"error": f"{str(e)}\n{traceback.format_exc()}"}




""" logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def detect_clothing_type(image_bytes: bytes):
    try:
        channel = ClarifaiChannel.get_grpc_channel()
        stub = service_pb2_grpc.V2Stub(channel)

        metadata = (('authorization', 'c538572ae2864a8680dd2583ff63e5e1'),)


        base64_bytes = base64.b64encode(image_bytes)

        def send_request():
            return stub.PostModelOutputs(
                service_pb2.PostModelOutputsRequest(
                    user_app_id=resources_pb2.UserAppIDSet(user_id="clarifai", app_id="main"),
                    model_id="apparel-detection",
                    model_version_id="1ed35c3d176f45d69d2aa7971e6ab9fe",
                    inputs=[
                        resources_pb2.Input(
                            data=resources_pb2.Data(
                                image=resources_pb2.Image(base64=base64_bytes)
                            )
                        )
                    ]
                ),
                metadata=metadata
            )

        response = await asyncio.get_event_loop().run_in_executor(None, send_request)

        if response.status.code != status_code_pb2.SUCCESS:
            return {"error": f"Clarifai error: {response.status.description}"}

        if not response.outputs or not response.outputs[0].data.concepts:
            return {
                "type": "unknown",
                "confidence": 0,
                "warning": "No clothing items detected"
            }

        concepts = response.outputs[0].data.concepts
        best_concept = max(concepts, key=lambda c: c.value)

        return {
            "type": best_concept.name,
            "confidence": float(best_concept.value),
            "all_concepts": {c.name: float(c.value) for c in concepts[:3]}
        }

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        logger.error(f"Detection failed: {str(e)}\n{error_details}")
        return {"error": f"{str(e)}\n{error_details}"}

 """