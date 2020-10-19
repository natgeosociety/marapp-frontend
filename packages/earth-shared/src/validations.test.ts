import { noSpecialCharsRule } from './validations';

describe('validations', () => {
  test('noSpecialCharsRule()', () => {
    const ruleWithDefaultMessage = noSpecialCharsRule();
    const defaultMessage = 'Special characters are not allowed';
    expect(ruleWithDefaultMessage('Text With #%$#^%$')).toBe(defaultMessage);
    expect(ruleWithDefaultMessage('OK text')).toBe(true);

    const errorMessage = 'Custom error message';
    const ruleWithCustomMessage = noSpecialCharsRule(errorMessage);
    expect(ruleWithCustomMessage('Text With #%$#^%$')).toBe(errorMessage);
    expect(ruleWithCustomMessage('OK text')).toBe(true);
  });
});
