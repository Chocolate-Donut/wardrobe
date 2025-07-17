// components/TestMessage.tsx
import { message, Button } from 'antd';

const TestMessage = () => {
  return <Button onClick={() => message.success('Привет, мир!')}>Тест</Button>;
};

export default TestMessage;
