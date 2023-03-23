import { LiHTMLAttributes } from 'react'

const NavItem = ({ className, children }: LiHTMLAttributes<HTMLLIElement>) => {
  return <li className={`relative px-3 py-5 ${className}`}>{children}</li>
}

export default NavItem
