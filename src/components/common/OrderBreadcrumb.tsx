import Link from "next/link";

type Step = {
  label: string;
  url: string;
  isActive: boolean;
};

type Props = {
  steps: Step[];
};

const BreadcrumbStep: React.FC<Props> = ({ steps }) => {
  return (
    <div className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-400 border-b border-gray-300 pb-6 my-4">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center text-2xl space-x-2">
          <span className={step.isActive ? 'text-black' : 'text-gray-400'}>
            <Link href={step.url}>
              {step.label}
            </Link>
          </span>
          {index < steps.length - 1 && <span className="text-gray-300">{'>'}</span>}
        </div>
      ))}
    </div>
  );
};

export default BreadcrumbStep;
