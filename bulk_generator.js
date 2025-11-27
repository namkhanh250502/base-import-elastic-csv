
/**
 * Hướng dẫn
 * B1: Nhập mapping vào file ./mappings/ẽp.js
 * B2: Biến csvFile là file CSV đầu vào của bạn
 * B3: Biến bulkFile là file JSON đầu ra của bạn
 * B4: Biến indexName là tên index bạn muốn import dữ liệu vào
 * B5: Chạy file này bằng nodejs: node bulk_generator.js
 * B6: Dùng file JSON xuất ra để import vào Elasticsearch
 *  Sử dụng lệnh: POST /index/_bulk
 * Lưu ý: Nếu là nested thì replace('"[','[').replace(']"',']') thủ công trước khi import
 */


// bulk_generator.js
const fs = require("fs");
const csv = require("csv-parser");

// import mapping của bạn
const mapping = require("./mappings/exp");

//File import
const csvFile = "nested_page_1.csv";
//Json import
const bulkFile = "bulk_import.json";
//Index import
const indexName = "network_nested_new";

// Convert primitive types
function convertValue(type, value) {
    if (value === "" || value === undefined) return undefined;

    switch (type) {
        case "long":
        case "integer":
            return parseInt(value, 10);
        case "boolean":
            return value.toString().toLowerCase() === "true";
        case "date":
            return value; // giả sử CSV đã đúng format
        case "keyword":
        case "text":
            return value.toString();
        default:
            return value;
    }
}

// Parse JSON string for nested/object fields
function parseJSONField(fieldMapping, value) {
    if (!value) return undefined;

    try {
        const parsed = JSON.parse(value);

        if (fieldMapping.type === "nested") {
            // luôn trả về array
            return Array.isArray(parsed) ? parsed : [parsed];
        }
        if (fieldMapping.type === "object") {
            return typeof parsed === "object" && !Array.isArray(parsed) ? parsed : undefined;
        }
    } catch (err) {
        console.warn("Failed to parse JSON for field:", value);
        return undefined;
    }

    return convertValue(fieldMapping.type || "text", value);
}

// Process each field
function processField(fieldMapping, value) {
    if (!fieldMapping || value === undefined || value === "") return undefined;

    if (fieldMapping.type === "nested" || fieldMapping.type === "object") {
        return parseJSONField(fieldMapping, value);
    }

    return convertValue(fieldMapping.type || "text", value);
}

// Create write stream for bulk JSON
const output = fs.createWriteStream(bulkFile);

fs.createReadStream(csvFile)
    .pipe(csv())
    .on("data", (row) => {
        const doc = {};

        // Process each field according to mapping
        for (const key of Object.keys(mapping)) {
            if (row[key] !== undefined) {
                const value = processField(mapping[key], row[key]);
                if (value !== undefined) doc[key] = value;
            }
        }

        // Write bulk action line
        output.write(JSON.stringify({ index: { _index: indexName, _id: row._id || row.id } }) + "\n");
        // Write data line
        output.write(JSON.stringify(doc) + "\n");
    })
    .on("end", () => {
        output.end();
        console.log("Bulk JSON ready:", bulkFile);
    });
