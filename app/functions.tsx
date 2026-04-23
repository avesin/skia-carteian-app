interface EvaluateParams {
    label: string;
    funcation: string;
    params: string[];
    evaluate(params: any, w: number, h: number, step: number): { x: number; y: number }[]
}

const hypotrochoid: EvaluateParams = {
    label: 'Hypotrochoid',
    funcation: `(R - r) * cos(t) + d * cos(((R - r) / r) * t)`,
    params: ['R', 'r', 'd'],
    evaluate: ({ R, r, d }, w, h,  step = 0.02) => {
        const points: { x: number; y: number }[] = [];
        const maxT = Math.PI * 20;

        for (let t = 0; t < maxT; t += step) {
            const x =
                (R - r) * Math.cos(t) +
                d * Math.cos(((R - r) / r) * t);

            const y =
                (R - r) * Math.sin(t) -
                d * Math.sin(((R - r) / r) * t);

            points.push({
                x: x + w / 2,
                y: y + h / 2,
            });
        }
        return points;
    },
}

const lissajous: EvaluateParams = {
    label: 'Lissajous',
    funcation: `A * sin(a * t + delta)`,
    params: ['A', 'B', 'a', 'b'],
    evaluate: ({ A, B, a, b }, w, h, delta = Math.PI / 2, step = 0.02) => {
        const points: { x: number; y: number }[] = [];
        const maxT = Math.PI * 20;

        for (let t = 0; t < maxT; t += step) {
            const x = A * Math.sin(a * t + delta);
            const y = B * Math.sin(b * t);

            points.push({
                x: x + w / 2,
                y: y + h / 2,
            });
        }
        return points;
    }
}

const rose: EvaluateParams = {
    label: 'Rose',
    funcation: `d * cos(k * t)`,
    params: ['k', 'd'],
    evaluate: ({ k, d }, w, h, step = 0.02) => {
        const points: { x: number; y: number }[] = [];
        const maxT = Math.PI * 20;

        for (let t = 0; t < maxT; t += step) {
            const r = d * Math.cos(k * t);
            const x = r * Math.cos(t);
            const y = r * Math.sin(t);

            points.push({
                x: x + w / 2,
                y: y + h / 2,
            });
        }
        return points;
    }
}

const cartesian: EvaluateParams = {
    label: 'Cartesian',
    funcation: `A * cos(a * t) :: B * cos(b * t)`,
    params: ['A', 'B', 'a', 'b'],
    evaluate: ({ A, B, a, b }, w, h, step = 0.02) => {
        const points: { x: number; y: number }[] = [];
        const maxT = Math.PI * 20;

        for (let t = 0; t < maxT; t += step) {
            const x = A * Math.cos(a * t);
            const y = B * Math.cos(b * t);

            points.push({
                x: x + w / 2,
                y: y + h / 2,
            });
        }
        return points;
    }
}

export default [hypotrochoid, lissajous, rose, cartesian] as EvaluateParams[];
export type { EvaluateParams };
