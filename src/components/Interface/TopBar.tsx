const TopBar = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="h-16 bg-zinc-800 flex flex-row">
            {children}
        </div>
    )
}

export default TopBar;