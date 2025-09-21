const fs = require('fs').promises;
const path = require('path');

/**
 * Read JSON data from file
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<any>} - Parsed JSON data
 */
async function readFileData(filePath) {
    try {
        // Check if file exists
        await fs.access(filePath);

        // Read and parse file
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);

    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, return empty array
            console.log(`[FILE] Creating new file: ${filePath}`);
            await writeFileData(filePath, []);
            return [];
        }

        console.error(`[FILE] Error reading ${filePath}:`, error);
        throw error;
    }
}

/**
 * Write JSON data to file
 * @param {string} filePath - Path to the JSON file
 * @param {any} data - Data to write
 * @returns {Promise<void>}
 */
async function writeFileData(filePath, data) {
    try {
        // Ensure directory exists
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, {recursive: true});

        // Write data to file
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, jsonData, 'utf8');

        console.log(`[FILE] Successfully wrote data to ${filePath}`);

    } catch (error) {
        console.error(`[FILE] Error writing to ${filePath}:`, error);
        throw error;
    }
}

/**
 * Append data to JSON array file
 * @param {string} filePath - Path to the JSON file
 * @param {any} newData - Data to append
 * @returns {Promise<void>}
 */
async function appendFileData(filePath, newData) {
    try {
        const existingData = await readFileData(filePath);

        if (!Array.isArray(existingData)) {
            throw new Error('File does not contain an array');
        }

        existingData.push(newData);
        await writeFileData(filePath, existingData);

    } catch (error) {
        console.error(`[FILE] Error appending to ${filePath}:`, error);
        throw error;
    }
}

/**
 * Check if file exists
 * @param {string} filePath - Path to check
 * @returns {Promise<boolean>}
 */
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get file statistics
 * @param {string} filePath - Path to the file
 * @returns {Promise<object>} - File stats
 */
async function getFileStats(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory()
        };
    } catch (error) {
        console.error(`[FILE] Error getting stats for ${filePath}:`, error);
        throw error;
    }
}

/**
 * Delete file
 * @param {string} filePath - Path to the file to delete
 * @returns {Promise<void>}
 */
async function deleteFile(filePath) {
    try {
        await fs.unlink(filePath);
        console.log(`[FILE] Successfully deleted ${filePath}`);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(`[FILE] Error deleting ${filePath}:`, error);
            throw error;
        }
        // File doesn't exist, which is fine for delete operation
    }
}

/**
 * Backup file with timestamp
 * @param {string} filePath - Path to the file to backup
 * @returns {Promise<string>} - Path to backup file
 */
async function backupFile(filePath) {
    try {
        const exists = await fileExists(filePath);
        if (!exists) {
            throw new Error('File does not exist');
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = `${filePath}.backup.${timestamp}`;

        const data = await fs.readFile(filePath);
        await fs.writeFile(backupPath, data);

        console.log(`[FILE] Created backup: ${backupPath}`);
        return backupPath;

    } catch (error) {
        console.error(`[FILE] Error creating backup for ${filePath}:`, error);
        throw error;
    }
}

module.exports = {
    readFileData,
    writeFileData,
    appendFileData,
    fileExists,
    getFileStats,
    deleteFile,
    backupFile
};