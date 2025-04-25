import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Quantum
                size="60"
                speed="1.75"
                color="white"
            />
        </div>
    );
};

export default LoadingSpinner;