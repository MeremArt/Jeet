interface LogoProps {
  variant?: 'light' | 'dark';
}

export default function Logo({ variant = 'dark' }: LogoProps) {
  return (
    <div className={`font-courier font-bold text-2xl leading-[27px] ${
      variant === 'light' ? 'text-[#F5F5F5]' : 'text-[#121212]'
    }`}>
      Paj.cash
    </div>
  );
}