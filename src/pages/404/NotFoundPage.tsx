import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, Page not found."
      extra={
        <Button
          onClick={() => {
            navigate("/");
          }}
          type="primary"
        >
          Về trang chủ
        </Button>
      }
    />
  );
};
