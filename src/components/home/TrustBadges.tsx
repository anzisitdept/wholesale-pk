import React from 'react';

export default function TrustBadges() {
  const badges = [
    { id: 1, title: 'Premium\nQuality\nGuaranteed', img: 'https://nisarachar.com/cdn/shop/files/Artboard_1_150x.png' },
    { id: 2, title: 'Made with Excellence', img: 'https://nisarachar.com/cdn/shop/files/Artboard_1_copy_150x.png' },
    { id: 3, title: 'Safe & Reliable\nPackaging', img: 'https://nisarachar.com/cdn/shop/files/Artboard_1_copy_2_150x.png' },
    { id: 4, title: 'Pakistan’s Most\nTrusted Online\nGeneral Store', img: 'https://nisarachar.com/cdn/shop/files/Artboard_1_copy_3_150x.png' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center text-center group">
              <div className="w-32 h-32 rounded-full border-[3px] border-[#000000] p-4 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-sm bg-[#f5f5f5]">
                <img src={badge.img} alt="Trust Icon" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <h3 className="font-bold text-[#232323] text-sm whitespace-pre-line leading-snug">
                {badge.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
