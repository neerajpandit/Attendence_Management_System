import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faUser } from '@fortawesome/free-solid-svg-icons';

const DetailsCard = ({
  type = 'value',
  icon,
  heading,
  total,
  array,
  color = 'amber',
  key,
}) => {
  return (
    <div
      className="max-w-sm w-full bg-white shadow-2xl rounded-lg border-t border-gray-100"
      key={key}
    >
      {/* Header Section */}
      <div className={`px-4 py-3`}>
        <div className="flex items-center gap-3 justify-between">
          <div className="text-2xl w-1/2 flex justify-center items-center">
            <div>
              <FontAwesomeIcon
                icon={icon}
                className={`text-${color}-400 text-[2rem]`}
              />
            </div>
          </div>
          <div>
            <h1 className="text-xs font-semibold uppercase text-gray-500">
              {heading}
            </h1>
            <p className={`text-3xl font-bold text-${color}-500`}>{total}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-2 gap-3 p-3">
        {array.map((item, index) => (
          <div
            key={index}
            className={`bg-gray-50 rounded-md shadow-md p-2 flex flex-col items-center justify-center border border-${color}-100`}
          >
            <p className="text-xs font-medium text-gray-600">{item.key}</p>
            <p className="text-sm font-bold text-gray-800">
              {type === 'rupee' ? '₹' : ''} {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsCard;
