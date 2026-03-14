import { describe, it, expect, vi, beforeEach } from 'vitest'
import { formatCSVFileToJSONFile } from "../formatCSVFileToJSONFile";
import { readFile, writeFile } from 'node:fs/promises';

vi.mock('node:fs/promises', () => ({
    readFile: vi.fn(),
    writeFile: vi.fn()
}));

const mockedReadFile = vi.mocked(readFile);
const mockedWriteFile = vi.mocked(writeFile);

describe('formatCSVFileToJSONFile', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('successfully converts CSV to JSON', async () => {
        mockedReadFile.mockResolvedValue("header1;header2\nvalue1;A\nvalue2;B");
        await formatCSVFileToJSONFile('input.csv', 'output.json', ';');

        expect(mockedReadFile).toHaveBeenCalledTimes(1);
        expect(mockedReadFile).toHaveBeenCalledWith('input.csv', 'utf-8');
        expect(mockedWriteFile).toHaveBeenCalledTimes(1);
        expect(mockedWriteFile).toHaveBeenCalledWith(
            'output.json',
            JSON.stringify([
                { header1: 'value1', header2: 'A' },
                { header1: 'value2', header2: 'B' }
            ], null, 2)
        );
    });

    it('throws error for empty file paths', async () => {
        await expect(formatCSVFileToJSONFile('', 'output.json', ';'))
            .rejects.toThrow("Error: Необходимо указать корректный путь");

        await expect(formatCSVFileToJSONFile('input.csv', '', ';'))
            .rejects.toThrow("Error: Необходимо указать корректный путь");
    });

    it('handles missing input file', async () => {
        mockedReadFile.mockRejectedValue(new Error('ENOENT'));

        await expect(formatCSVFileToJSONFile('input.csv', 'output.json', ';'))
            .rejects.toThrow("Ошибка чтения файла: input.csv");
    });

    it('handles empty CSV file', async () => {
        mockedReadFile.mockResolvedValue('');

        await expect(formatCSVFileToJSONFile('input.csv', 'output.json', ';'))
            .rejects.toThrow('Error: Некорректная передача параметра input!');
    });

    it('handles file write error', async () => {
        mockedReadFile.mockResolvedValue("header1;header2\nvalue1;A");
        mockedWriteFile.mockRejectedValue(new Error('EACCES'));

        await expect(formatCSVFileToJSONFile('input.csv', 'output.json', ';'))
            .rejects.toThrow('Ошибка записи в файл: output.json');
    });
});