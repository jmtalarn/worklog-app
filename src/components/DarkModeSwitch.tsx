export const DarkModeSwitch = () => <button
	onClick={() => document.documentElement.classList.toggle('dark')}
	className="px-3 py-1 border rounded"
>
	🌗 Mode
</button>
