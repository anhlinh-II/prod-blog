import Link from "next/link";

type Step = {
  label: string;
  url: string;
  isActive: boolean;
};

type Props = {
  steps: Step[];
};

const OrderBreadcrumb: React.FC<Props> = ({ steps }) => {
  return (
    <div className="hidden md:flex items-center justify-center space-x-2 text-sm font-medium text-gray-400 border-b border-gray-300 pb-6 my-4">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center text-base md:text-2xl md:space-x-2">
          <span className={`${step.isActive ? 'text-black' : 'text-gray-400'}
              ${step.url == '' || !step.url ? 'cursor-not-allowed' : ''}`}>
            <Link href={step.url} className={`${step.url == '' || !step.url ? 'cursor-not-allowed' : ''}`}>
              {step.label}
            </Link>
          </span>
          {index < steps.length - 1 && <span className="text-gray-300">{'>'}</span>}
        </div>
      ))}
    </div>
  );
};

export default OrderBreadcrumb;
