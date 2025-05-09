import { BarChart3, LineChart, Leaf, ShoppingBag } from "lucide-react";
import React from "react";
import useGreenCreditStore from "../../store/greenCreditStore";

export default function MarketingPlan() {
  const { creditDetail } = useGreenCreditStore();

  const marketingChannels = creditDetail.marketing_channel.map((channel) => {
    const splittedStr = channel.split(":");
    const channelName = splittedStr[0].trim();
    const percentage = parseFloat(splittedStr[1].trim().replace("%", ""));
    return { name: channelName, percentage };
  });
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm col-span-2">
      <div className="flex items-center mb-3">
        <Leaf className="w-5 h-5 text-green-700 mr-2" />
        <h3 className="font-medium">Marketing Plan</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Marketing Channel</p>
              <p className="text-sm text-green-700">
                Production: <span className="font-bold">150kg/month</span>
              </p>
            </div>

            <div className="space-y-2">
              {marketingChannels.map((channel, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded">
                  <div className="flex justify-between">
                    <p className="text-sm">{channel.name}</p>
                    <p className="text-sm font-medium">{channel.percentage}%</p>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${channel.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="">
            <p className="text-sm font-medium mb-2">Marketing Plan</p>
            <div className="space-y-2">
              {creditDetail.marketing_plan
                .slice(0, 3)
                .map((strategy, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-50 p-2 rounded"
                  >
                    <LineChart className="w-4 h-4 text-green-700" />
                    <p className="text-sm">{strategy}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
