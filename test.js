const expect = chai.expect;

describe('Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    describe('evaluateExpression', () => {
        it('should correctly evaluate simple addition', () => {
            expect(calculator.evaluateExpression('3+5')).to.equal(8);
        });

        it('should correctly evaluate simple subtraction', () => {
            expect(calculator.evaluateExpression('10-4')).to.equal(6);
        });

        it('should correctly evaluate simple multiplication', () => {
            expect(calculator.evaluateExpression('4*7')).to.equal(28);
        });

        it('should correctly evaluate simple division', () => {
            expect(calculator.evaluateExpression('20/5')).to.equal(4);
        });

        it('should handle operator precedence (multiplication before addition)', () => {
            expect(calculator.evaluateExpression('2+3*4')).to.equal(14);
        });

        it('should handle operator precedence (division before subtraction)', () => {
            expect(calculator.evaluateExpression('10-8/2')).to.equal(6);
        });

        it('should handle parentheses to override precedence', () => {
            expect(calculator.evaluateExpression('(2+3)*4')).to.equal(20);
        });

        it('should handle complex expressions', () => {
            expect(calculator.evaluateExpression('10+2*(6-4)/2')).to.equal(12);
        });

        it('should handle floating point numbers', () => {
            expect(calculator.evaluateExpression('2.5+1.5')).to.equal(4);
        });

        it('should throw an error for division by zero', () => {
            expect(() => calculator.evaluateExpression('5/0')).to.throw('Division by zero');
        });

        it('should throw an error for mismatched parentheses', () => {
            expect(() => calculator.evaluateExpression('(2+3*4')).to.throw('Mismatched parentheses');
        });
    });

    describe('calculate', () => {
        it('should return the result of a valid expression and add to history', () => {
            const result = calculator.calculate('2+3*4');
            expect(result).to.equal(14);
            expect(calculator.getHistory()).to.deep.include({ expression: '2+3*4', result: 14 });
        });

        it('should return "Error" for an invalid expression', () => {
            expect(calculator.calculate('5/0')).to.equal('Error');
        });
    });

    describe('calculateSquareRoot', () => {
        it('should correctly calculate the square root of a number', () => {
            const result = calculator.calculateSquareRoot('16');
            expect(result).to.equal(4);
            expect(calculator.getHistory()).to.deep.include({ expression: '√(16)', result: 4 });
        });

        it('should return "Error" for a negative number', () => {
            expect(calculator.calculateSquareRoot('-4')).to.equal('Error');
        });
    });

    describe('calculatePercentage', () => {
        it('should correctly calculate the percentage of a number', () => {
            const result = calculator.calculatePercentage('50');
            expect(result).to.equal(0.5);
            expect(calculator.getHistory()).to.deep.include({ expression: '(50)%', result: 0.5 });
        });
    });
});