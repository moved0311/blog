'use client'
import Image from "next/image";

const DarkModeSwitch = () => {
	const onClick = () => {
		if (localStorage.theme === 'light') {
			document.documentElement.classList.add('dark')
			localStorage.theme = 'dark'
		} else {
			document.documentElement.classList.remove('dark')
			localStorage.theme = 'light'
		}
	}

	return (
		<button onClick={onClick} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-300">
			<Image src="/icons/dark-mode.png" width={20} height={20} alt="dark-mode-icon" />
		</button>
	)
}

export default DarkModeSwitch