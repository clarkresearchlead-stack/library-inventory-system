type AppLogoProps = {
  className?: string
  alt?: string
}

export function AppLogo({ className = 'h-12 w-12 object-contain', alt = 'Library Inventory logo' }: AppLogoProps) {
  return <img src="/logo.png" alt={alt} className={className} />
}
