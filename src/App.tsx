import React, { useState } from 'react';
import './style.css';

const App: React.FC = () => {
    const [voltage, setVoltage] = useState<number>(1152);
    const [feedback, setFeedback] = useState<number>(1022);
    const [maxVoltage, setMaxVoltage] = useState<number | null>(2000);
    const [customPotInput, setCustomPotInput] = useState<string>('');
    const [tableHTML, setTableHTML] = useState<string>('');

    const generateTable = () => {
        const U = voltage;
        const R1 = feedback;
        console.log('hello');
        if (isNaN(U) || isNaN(R1) || U <= 0 || R1 <= 0) {
            alert('Please enter valid voltage, feedback, and voltage range values.');
            return;
        }

        if (maxVoltage !== null && maxVoltage < U) {
            alert('Maximum voltage should be greater than stock volt.');
            return;
        }

        let staticPot = [50, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 1000000];
        let customPotValues = customPotInput
            .split(/[,; ]+/)
            .map(Number)
            .filter(value => !isNaN(value) && value > 0)
            .sort((a, b) => a - b);

        staticPot = staticPot.filter(value => !customPotValues.includes(value));

        const allPots = [...staticPot, ...customPotValues];
        const percentages = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];

        let newTableHTML = `
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-white">
                <thead class="text-xl text-left uppercase bg-gray-700">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-xs sticky left-0 bg-gray-600">Pot (kΩ)</th>
                        ${percentages.map(p => `<th class="px-6 py-3 whitespace-nowrap">${p}%</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        allPots.forEach(potValue => {
            let isBold = customPotValues.includes(potValue);
            let rowHTML = `
            <tr class="odd:bg-gray-900 even:bg-gray-800 border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap sticky left-0 odd:bg-gray-800 even:bg-gray-700">
                    ${potValue / 1000}kΩ
                </th>`;
            let rowFitsCriteria = false;

            percentages.forEach(percentage => {
                const rpot = potValue * (percentage / 100);
                const Uout = Vout(U, R1, rpot);

                let cellColor = "#FFFFFF";
                if (Uout >= 1400 && Uout < 1600) {
                    cellColor = "#F2B705";
                } else if (Uout >= 1600 && Uout < 2000) {
                    cellColor = "#F27405";
                } else if (Uout >= 2000) {
                    cellColor = "#F21905";
                }

                if (maxVoltage === null || Uout <= maxVoltage) {
                    rowFitsCriteria = true;
                }

                rowHTML += `<td data-label="${percentage}%" style="color: ${cellColor};">${Math.round(Uout)} mV</td>`;
            });

            rowHTML += '</tr>';
            if (rowFitsCriteria || customPotValues.includes(potValue)) {
                newTableHTML += rowHTML;
            }
        });

        newTableHTML += `
                </tbody>
            </table>
        </div>
        `;

        setTableHTML(newTableHTML);
    };

    const Vout = (U1: number, R1: number, R2: number): number => {
        return U1 * R1 / (1 / (1 / R1 + 1 / R2));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-300">vMod Calculator</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label htmlFor="voltage" className="block text-gray-300 font-medium mb-2">
                            Voltage (mV) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="voltage"
                            name="voltage"
                            placeholder="Enter voltage in mV"
                            value={voltage}
                            onChange={(e) => setVoltage(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="feedback" className="block text-gray-300 font-medium mb-2">
                            Feedback (&Omega;) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="feedback"
                            name="feedback"
                            placeholder="Enter feedback in &Omega;"
                            value={feedback}
                            onChange={(e) => setFeedback(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="max-voltage" className="block text-gray-300 font-medium mb-2">
                            Maximum Voltage (mV)
                        </label>
                        <input
                            type="number"
                            id="max-voltage"
                            name="max-voltage"
                            value={maxVoltage ?? ''}
                            onChange={(e) => setMaxVoltage(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="custom-potentiometer" className="block text-gray-300 font-medium mb-2">
                            Custom Potentiometers (&Omega;)
                        </label>
                        <input
                            type="text"
                            id="custom-potentiometer"
                            name="custom-potentiometer"
                            placeholder="Enter custom potentiometers (&Omega;) separated by , ; or space"
                            value={customPotInput}
                            onChange={(e) => setCustomPotInput(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-400"
                        />
                    </div>
                </div>

                <button
                    id="generate-table"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors mt-4"
                    onClick={() => generateTable()}
                >
                    Calculate
                </button>
                <div id="table-container" className="mt-6 overflow-x-auto">
                    <div dangerouslySetInnerHTML={{ __html: tableHTML }} />
                </div>
            </div>
        </div>
    );
};

export default App;
