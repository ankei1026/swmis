import LayoutResident from '../Layout/LayoutResident';
import { usePage } from '@inertiajs/react';
import Title from '../Components/Title';

const ProperSegregation = () => {
    const page = usePage();

    return (
        <LayoutResident>
            <Title title="Proper Segregation" />
            <div className="w-full bg-gray-100 py-6 px-6 rounded-lg mt-6">
                <h2 className="text-xl font-semibold mb-4 text-green-700">
                    Waste Segregation Practices
                </h2>

                <p className="mb-4 text-gray-700">
                    Practicing proper waste segregation helps keep our community clean,
                    reduces pollution, and improves the efficiency of waste collection.
                    Please follow these guidelines:
                </p>

                <ul className="list-disc ml-6 space-y-2 text-gray-800">
                    <li>
                        <strong>Biodegradable Waste:</strong> Includes food scraps, fruit peels,
                        leaves, and other organic materials. Place these in the green bin.
                    </li>
                    <li>
                        <strong>Non-Biodegradable Recyclables:</strong> Such as plastic bottles, cans,
                        glass containers, cardboard, and paper. Clean and dry them before placing them
                        in the blue bin.
                    </li>
                    <li>
                        <strong>Residual Waste:</strong> Items like used tissues, sanitary waste,
                        Styrofoam, and dirty plastics belong in the black bin.
                    </li>
                    <li>
                        <strong>Hazardous Waste:</strong> Batteries, pesticides, chemicals,
                        broken bulbs, and electronic waste should be stored separately and brought to
                        designated drop-off points.
                    </li>
                    <li>
                        <strong>Segregate at Source:</strong> Always separate waste at home before
                        handing it over to waste collectors.
                    </li>
                    <li>
                        <strong>Label Your Bins:</strong> Properly labeled bins help avoid mixing
                        waste and make collection quicker.
                    </li>
                    <li>
                        <strong>Reduce, Reuse, Recycle:</strong> Minimize single-use plastics and
                        find ways to repurpose materials before disposing of them.
                    </li>
                </ul>

                <p className="mt-6 text-gray-700 italic mb-4">
                    Let’s work together to maintain a clean and sustainable community.
                </p>

                <img src="/assets/Propoer Segregation.jpg" alt="" />
            </div>
        </LayoutResident>
    );
};

export default ProperSegregation;