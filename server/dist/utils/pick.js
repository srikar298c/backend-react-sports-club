"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create an object composed of the picked object properties
 * @param object - The source object
 * @param keys - The keys to pick from the source object
 * @returns A new object containing only the picked properties
 */
const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && typeof object === 'object' && key in object) {
            // Access key safely after type narrowing
            const value = object[key];
            // Ensure the value is cast to a string if necessary
            obj[key] = Array.isArray(value) ? value.join(',') : String(value);
        }
        return obj;
    }, {});
};
exports.default = pick;
