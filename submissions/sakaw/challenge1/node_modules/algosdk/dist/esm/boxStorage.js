function translateBoxReference(reference, foreignApps, appIndex) {
    const referenceId = reference.appIndex;
    const referenceName = reference.name;
    const isOwnReference = referenceId === 0 || referenceId === appIndex;
    let index = 0;
    if (foreignApps != null) {
        // Foreign apps start from index 1; index 0 is its own app ID.
        index = foreignApps.indexOf(referenceId) + 1;
    }
    // Check if the app referenced is itself after checking the foreign apps array.
    // If index is zero, then the app ID was not found in the foreign apps array
    // or the foreign apps array was null.
    if (index === 0 && !isOwnReference) {
        // Error if the app is trying to reference a foreign app that was not in
        // its own foreign apps array.
        throw new Error(`Box ref with appId ${referenceId} not in foreign-apps`);
    }
    return { i: index, n: referenceName };
}
/**
 * translateBoxReferences translates an array of BoxReferences with app IDs
 * into an array of EncodedBoxReferences with foreign indices.
 */
export function translateBoxReferences(references, foreignApps, appIndex) {
    if (references == null)
        return [];
    return references.map((bx) => translateBoxReference(bx, foreignApps, appIndex));
}
//# sourceMappingURL=boxStorage.js.map