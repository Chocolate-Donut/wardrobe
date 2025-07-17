"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const { Option } = antd_1.Select;
const EditOutfitModal = ({ visible, onClose, onSave, outfit }) => {
    const [form] = antd_1.Form.useForm();
    (0, react_1.useEffect)(() => {
        if (outfit) {
            form.setFieldsValue({
                title: outfit.title,
                season: outfit.season,
                trend: outfit.trend,
                isPrivate: outfit.isPrivate,
                tags: typeof outfit.tags === 'string' ? JSON.parse(outfit.tags) : outfit.tags,
            });
        }
    }, [outfit]);
    const handleFinish = (values) => {
        onSave({ ...outfit, ...values });
        onClose();
    };
    return ((0, jsx_runtime_1.jsx)(antd_1.Modal, { title: "Edit Look", open: visible, onCancel: onClose, footer: null, children: (0, jsx_runtime_1.jsxs)(antd_1.Form, { form: form, layout: "vertical", onFinish: handleFinish, children: [(0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "title", label: "Title", children: (0, jsx_runtime_1.jsx)(antd_1.Input, {}) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "season", label: "Season", children: (0, jsx_runtime_1.jsxs)(antd_1.Select, { children: [(0, jsx_runtime_1.jsx)(Option, { value: "spring", children: "Spring" }), (0, jsx_runtime_1.jsx)(Option, { value: "summer", children: "Summer" }), (0, jsx_runtime_1.jsx)(Option, { value: "autumn", children: "Autumn" }), (0, jsx_runtime_1.jsx)(Option, { value: "winter", children: "Winter" })] }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "trend", label: "Trend", children: (0, jsx_runtime_1.jsxs)(antd_1.Select, { children: [(0, jsx_runtime_1.jsx)(Option, { value: "casual", children: "Casual" }), (0, jsx_runtime_1.jsx)(Option, { value: "glamor", children: "Glamor" }), (0, jsx_runtime_1.jsx)(Option, { value: "classic", children: "Classic" })] }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "tags", label: "Tags", children: (0, jsx_runtime_1.jsx)(antd_1.Select, { mode: "tags" }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "isPrivate", label: "Private", valuePropName: "checked", children: (0, jsx_runtime_1.jsx)(antd_1.Switch, {}) }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", htmlType: "submit", block: true, children: "Save" })] }) }));
};
exports.default = EditOutfitModal;
//# sourceMappingURL=EditOutfitModal.js.map