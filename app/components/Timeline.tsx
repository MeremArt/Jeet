import { BiCoin, BiPackage, BiBot } from "react-icons/bi";
import { BsCreditCard } from "react-icons/bs";

interface TimelineItemProps {
  label: string;
  icon: React.ReactNode;
  color: string;
}

function TimelineItem({ label, icon, color }: TimelineItemProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-[30px] h-[30px] rounded flex items-center justify-center`}
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div className="h-[63px] w-[1px] bg-[#ECECEC] my-2" />
      <span className="text-white font-montserrat text-base font-medium">
        {label}
      </span>
    </div>
  );
}

export default function Timeline() {
  return (
    <div className="relative w-full max-w-[903px] mt-16">
      <div className="absolute top-[30px] w-full h-[1px] bg-[#ECECEC]" />
      <div className="relative flex justify-between">
        <TimelineItem
          label="Product Launch"
          icon={<BiCoin className="w-4 h-4 text-[#ECECEC]" />}
          color="#FF5722"
        />
        <TimelineItem
          label="Digital Debit Card"
          icon={<BsCreditCard className="w-4 h-4 text-[#ECECEC]" />}
          color="#CDDC39"
        />
        <TimelineItem
          label="Token Launch"
          icon={<BiPackage className="w-4 h-4 text-[#ECECEC]" />}
          color="#7C22FF"
        />
        <TimelineItem
          label="AI Integration"
          icon={<BiBot className="w-4 h-4 text-[#ECECEC]" />}
          color="#00BCD4"
        />
      </div>
    </div>
  );
}
