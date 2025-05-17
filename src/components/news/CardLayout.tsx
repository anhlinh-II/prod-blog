interface CardLayoutProps {
  mainCard: React.ReactNode;
  sideCards: React.ReactNode;
}

export default function CardLayout({ mainCard, sideCards }: CardLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 max-w-6xl mx-auto">
      {/* Card lớn bên trái */}
      <div className="">
        {mainCard}
      </div>

      {/* 4 card nhỏ bên phải */}
      <div className="grid grid-cols-2 gap-4">
        {sideCards}
      </div>
    </div>
  );
}
