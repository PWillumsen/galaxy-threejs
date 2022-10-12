
export function normDist(mean: number, stddev: number) {
    const z0 = boxMullerTransform();

    return z0 * stddev + mean;
}


function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    return z0;
}

