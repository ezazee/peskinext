import Image from "next/image";

type AvatarProps = {
  name: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

/**
 * Get initials from name
 * Takes first letter of first name
 */
function getInitials(name: string): string {
  if (!name) return "?";

  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "?";

  // Take first letter of first name only
  return words[0][0].toUpperCase();
}

/**
 * Always return purple color for consistency
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getColorFromName(_name: string): string {
  return "bg-purple-500";
}

export function Avatar({ name, avatarUrl, size = "md", className = "" }: AvatarProps) {
  const hasImage = avatarUrl && avatarUrl !== "/images/avatar/default-avatar.png";
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  if (hasImage) {
    return (
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden ${className}`}>
        <Image
          src={avatarUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
    >
      {initials}
    </div>
  );
}
