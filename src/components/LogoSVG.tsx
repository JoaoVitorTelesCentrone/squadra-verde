interface LogoSVGProps {
  color?: string;
  width?: number;
  height?: number;
}

export default function LogoSVG({ color = '#f5efe6', width = 32, height = 52 }: LogoSVGProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 162" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="46" rx="38" ry="40" stroke={color} strokeWidth="3.5" fill="none"/>
      <circle cx="38" cy="23" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="47" cy="23" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="56" cy="23" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="65" cy="23" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="29" cy="32" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="38" cy="32" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="47" cy="32" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="56" cy="32" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="65" cy="32" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="74" cy="32" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="29" cy="41" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="38" cy="41" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="47" cy="41" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="56" cy="41" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="65" cy="41" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="74" cy="41" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="29" cy="50" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="38" cy="50" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="47" cy="50" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="56" cy="50" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="65" cy="50" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="74" cy="50" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="29" cy="59" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="38" cy="59" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="47" cy="59" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="56" cy="59" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="65" cy="59" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="74" cy="59" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="29" cy="68" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="38" cy="68" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="47" cy="68" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="56" cy="68" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="65" cy="68" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="47" cy="77" r="2.6" fill={color} opacity="0.9"/>
      <circle cx="56" cy="77" r="2.6" fill={color} opacity="0.9"/>
      <path d="M 36 86 C 40 94 45.5 98 45.5 102" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M 64 86 C 60 94 54.5 98 54.5 102" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <rect x="45.5" y="102" width="9.0" height="52" rx="2.5" stroke={color} strokeWidth="3.5" fill="none"/>
      <line x1="46.5" y1="107" x2="53.5" y2="110.5" stroke={color} strokeWidth="1.2" opacity="0.4"/>
      <line x1="46.5" y1="114" x2="53.5" y2="117.5" stroke={color} strokeWidth="1.2" opacity="0.4"/>
      <line x1="46.5" y1="121" x2="53.5" y2="124.5" stroke={color} strokeWidth="1.2" opacity="0.4"/>
      <line x1="46.5" y1="128" x2="53.5" y2="131.5" stroke={color} strokeWidth="1.2" opacity="0.4"/>
      <line x1="46.5" y1="135" x2="53.5" y2="138.5" stroke={color} strokeWidth="1.2" opacity="0.4"/>
      <line x1="46.5" y1="142" x2="53.5" y2="145.5" stroke={color} strokeWidth="1.2" opacity="0.4"/>
      <rect x="43.5" y="154" width="13.0" height="6" rx="3" stroke={color} strokeWidth="2.5" fill="none"/>
    </svg>
  );
}
