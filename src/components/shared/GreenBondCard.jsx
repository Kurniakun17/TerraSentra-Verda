import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/functions";

export const GreenBondCard = ({ bond }) => {
  const progress = Math.floor((bond.fundraised / bond.fundrequired) * 100);

  const images = [
    "https://cdn.prod.website-files.com/66b08e9ac816df76ceba1aab/66b08e9ac816df76ceba1dfe_article-facts-reforestation-prestataire.webp",
    "https://www.montereyboats.com/zupload/library/255/-601-960x4000-0.jpg?ztv=20141215115108",
    "https://joca-cable.com/wp-content/uploads/2024/07/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%9A%84%E8%AE%BE%E8%AE%A1-72-1.png",
  ];

  return (
    <div className="pt-6 rounded-xl ">
      <div className="flow-root bg-white rounded-lg overflow-clip border border-gray-300 pb-8 ">
        <div>
          <img
            src={images[(bond.id % 3)]}
            alt={bond.title}
            className="object-cover max-h-[200px] w-full"
          />
        </div>
        <div className="mt-6 px-6">
          <Link
            to={`/greenbond/${bond.id}`}
            className="mt-4 uppercase text-lg font-bold text-gray-900 tracking-tight"
          >
            {bond.name}
          </Link>
          <p className="mt-1 text-base text-gray-500">{bond.description}</p>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Funding Progress
              </span>
              <span className="text-sm font-medium text-gray-700">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm font-medium text-gray-700">
                {formatCurrency(bond.fundraised)}
              </span>
              <span className="text-sm font-medium text-gray-700">
                from {formatCurrency(bond.fundrequired)}
              </span>
            </div>

            <div className="flex grid-cols-2 mt-4 gap-4 overflow-clip">
              <Link
                to={`/greenbond/${bond.id}`}
                className="w-full text-center bg-primary hover: rounded-xl py-3 text-white"
              >
                Fund Now!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
