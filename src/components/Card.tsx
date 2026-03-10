import { useNavigate } from "react-router-dom";
import { toVND } from "../utils/toVND";
import { HeartOutlined } from "@ant-design/icons";

const Card = ({
  id,
  name,
  image,
  price,
}: {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/detail/${id}`);
      }}
      className="w-[22%] h-62.5 lg:h-100 bg-white shadow-md rounded-lg cursor-pointer overflow-hidden border-t border-gray-200"
    >
      <div className="h-3/4 w-full flex ">
        <img src={image} alt={name} className="w-full object-cover" />
      </div>
      <div className="p-2!">
        <p className="font-semibold truncate">{name}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-red-500">{toVND(price)}</p>
          <HeartOutlined />
        </div>
        {/* <p className="text-sm">{description}</p> */}
      </div>
    </div>
  );
};

export default Card;
