export function TaskList() {

    return (
        <>
        {/* First box */}
                <div className="flex-1 flex flex-col items-start p-6 gap-4">
                    <h2 className="leading-none">1</h2>
                    <p>Water tomato plants</p>
                </div>
                {/* Second box */}
                <div className="flex-1 flex flex-col items-start p-8 gap-6">
                    <h2 className="leading-none">2</h2>
                    <p>Plant seeds</p>
                </div>
                {/* Third box */}
                <div className="flex-1 flex flex-col items-start p-8 gap-6">
                    <h2 className="leading-none">3</h2>
                    <p>Add fertilizer</p>
                </div>
            </>

            );

}