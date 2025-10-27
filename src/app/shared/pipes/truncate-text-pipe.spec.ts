import { TruncateTextPipe } from './truncate-text-pipe';

describe('TruncateTextPipe', () => {
  let pipe: TruncateTextPipe;

  beforeEach(() => {
    pipe = new TruncateTextPipe();
  });

  it('creates the pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns empty string when value is falsy', () => {
    expect(pipe.transform('' as any)).toBe('');
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('does not truncate when value length is equal to limit', () => {
    const value = '12345';
    expect(pipe.transform(value, 5)).toBe(value);
  });

  it('does not truncate when value length is less than limit', () => {
    const value = 'short';
    expect(pipe.transform(value, 10)).toBe(value);
  });

  it('truncates and appends default trail when value length exceeds default limit', () => {
    const value = 'abcdefghijklmnopqrstuvwxyz';

    expect(pipe.transform(value)).toBe(value.substring(0, 20) + '...');
  });

  it('truncates and appends custom trail and custom limit', () => {
    const value = 'HelloWorldExample';
    const limit = 5;
    const trail = '~~';
    expect(pipe.transform(value, limit, trail)).toBe(
      value.substring(0, limit) + trail
    );
  });
});
