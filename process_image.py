# process_image.py
import sys
from rembg import remove
from PIL import Image
import io

def process_image(input_path, output_path):
    with open(input_path, 'rb') as input_file:
        input_data = input_file.read()

    # Удаление фона
    output_data = remove(input_data)

    with open(output_path, 'wb') as output_file:
        output_file.write(output_data)

if __name__ == '__main__':
    input_image_path = sys.argv[1]
    output_image_path = sys.argv[2]
    process_image(input_image_path, output_image_path)
