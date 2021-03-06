function getAllKeys(obj) {
    // from: https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object
    let keys = []
    // if primitive, skip the first iteration
    if (!(obj instanceof Object)) {
        obj = Object.getPrototypeOf(obj)
    }
    while (obj) {
        keys = keys.concat(Reflect.ownKeys(obj))
        obj = Object.getPrototypeOf(obj)
    }
    return keys
}

function getAllKeysDescriptions(obj) {
        let descriptors = []
        // if primitive, skip the first iteration
        if (!(obj instanceof Object)) {
            obj = Object.getPrototypeOf(obj)
        }
        while (obj) {
            descriptors = descriptors.concat(
                Reflect.ownKeys(obj).map(
                    eachKey=>({
                        from: obj,
                        key: eachKey,
                        descriptor: Reflect.getOwnPropertyDescriptor(obj, eachKey)
                    })
                )
            )
            obj = Object.getPrototypeOf(obj)
        }
        return descriptors
    }

const debugValue = (value) => {
    // undefined
    if (value === undefined) {
        return {
            valueItself: value,
            isUndefined: true,
            isNull: false,
            doubleEqualToNull: true,
            tripleEqualToNull: false,
            typeof: typeof value,
            stringified: undefined,
            objectIsFrozen: Object.isFrozen(value),
        }
    // null
    } else if (value === null) {
        return {
            valueItself: value,
            isUndefined: false,
            isNull: true,
            doubleEqualToNull: true,
            tripleEqualToNull: true,
            typeof: typeof value,
            stringified: "null",
            objectIsFrozen: Object.isFrozen(value),
        }
    // primitives and objects
    } else {
        function getAllKeys(obj) {
            // from: https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object
            let keys = []
            // if primitive, skip the first iteration
            if (!(obj instanceof Object)) {
                obj = Object.getPrototypeOf(obj)
            }
            while (obj) {
                keys = keys.concat(Reflect.ownKeys(obj))
                obj = Object.getPrototypeOf(obj)
            }
            return keys
        }

        function getAllKeysDescriptions(obj) {
            let descriptors = []
            // if primitive, skip the first iteration
            if (!(obj instanceof Object)) {
                obj = Object.getPrototypeOf(obj)
            }
            while (obj) {
                descriptors = descriptors.concat(
                    Reflect.ownKeys(obj).map(
                        eachKey=>({
                            from: obj,
                            key: eachKey,
                            descriptor: Reflect.getOwnPropertyDescriptor(obj, eachKey)
                        })
                    )
                )
                obj = Object.getPrototypeOf(obj)
            }
            return descriptors
        }

        const output = {
            valueItself: value,
            typeof: typeof value,
            constructorName: value.constructor instanceof Object && value.constructor.name,
            prototype: Object.getPrototypeOf(value),
            stringified: Error,
            instanceofObject: value instanceof Object,
            ifStatementTreatsAs: value ? true : false,
            doubleEqualToFalse: value == false,
            doubleEqualToTrue: value == false,
            objectIsFrozen: Object.isFrozen(value),
            isNaN: value !== value,
            isUndefined: false,
            isNull: false,
            doubleEqualToNull: value == null,
            tripleEqualToNull: value === null,
            valueOf: undefined,
            toString: undefined,
            isArray: value instanceof Array,
            iterableUsingForIn: false,
            iterableUsingForof: false,
            keys: Object.keys(value),
            getOwnPropertyNames: Object.getOwnPropertyNames(value),
            allPropertyDescriptions: getAllKeysDescriptions(value),
        }

        // 
        // valueOf
        // 
        if (value.valueOf instanceof Function) {
            output.valueOf = value.valueOf()
        }
        // 
        // toString
        // 
        if (value.toString instanceof Function) {
            output.toString = value.toString()
            if (typeof output.toString == 'string') {
                output.toString = JSON.stringify(output.toString)
            }
        }
        // 
        // stringify
        // 
        try {
            output.stringified = JSON.stringify(value)
        } catch (error) {
            output.stringified = error
        }

        // 
        // iterable
        // 
        try {
            for (const each in value) { break }
            output.iterableUsingForIn = true
        } catch (error) {}
        try {
            for (const each of value) { break }
            output.iterableUsingForOf = true
        } catch (error) {}

        return output
    }
}

const debugValueAsString = (value) => {
    const indent = `    `
    // undefined
    if (value === undefined) {
        return JSON.stringify({
            valueItself: value,
            isUndefined: true,
            isNull: false,
            doubleEqualToNull: true,
            tripleEqualToNull: false,
            typeof: typeof value,
            stringified: undefined,
            objectIsFrozen: Object.isFrozen(value),
        }, 0, indent.length)
    // null
    } else if (value === null) {
        return JSON.stringify({
            valueItself: value,
            isUndefined: false,
            isNull: true,
            doubleEqualToNull: true,
            tripleEqualToNull: true,
            typeof: typeof value,
            stringified: "null",
            objectIsFrozen: Object.isFrozen(value),
        }, 0, indent.length)
    // primitives and objects
    } else {
        function getAllKeysAsString(obj) {
            // from: https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object
            let keys = []
            // if primitive, skip the first iteration
            if (!(obj instanceof Object)) {
                obj = Object.getPrototypeOf(obj)
            }
            while (obj) {
                keys = keys.concat(Reflect.ownKeys(obj))
                obj = Object.getPrototypeOf(obj)
            }
            return JSON.stringify(keys)
        }
        
        function getAllKeysDescriptions(obj) {
            if (obj == null) {
                return []
            }
            // if primitive, skip the first iteration
            if (!(obj instanceof Object)) {
                obj = Object.getPrototypeOf(obj)
            }
            let descriptors = []
            while (obj) {
                descriptors = descriptors.concat(
                    Reflect.ownKeys(obj).map(
                        eachKey=>({
                            from: obj,
                            key: eachKey,
                            descriptor: Reflect.getOwnPropertyDescriptor(obj, eachKey)
                        })
                    )
                )
                obj = Object.getPrototypeOf(obj)
            }
            return descriptors
        }
        
        function getAllKeysDescriptionsAsString(obj) {
            const descriptors = getAllKeysDescriptions(obj)
            const stringKeys = descriptors.map(({from, key, descriptor})=>[`${from.constructor instanceof Object && from.constructor.name || from}[${JSON.stringify(key)}]: `, key, descriptor,])
            const maxLength = Math.max(...stringKeys.map(each=>each[0].length))
            const paddedStringKeys = stringKeys.map(([string, key, descriptor])=>[string.padEnd(maxLength, " "), key, descriptor])
            const booleanSpacer = (bool) => bool ? `true ` : `false`
            let descriptorsString = `[\n`
            for (const [stringKey, key, descriptor] of paddedStringKeys) {
                let { value, writable, get, set, configurable, enumerable} = descriptor
                get = get instanceof Function ? `Function ` : `undefined`
                set = set instanceof Function ? `Function ` : `undefined`
                const isGetterSetter = get === `Function ` || set === `Function `
                if (isGetterSetter) {
                    try {
                        value = value[key]
                    } catch (error) {
                        value = error
                    }
                }
                const isMethod = value instanceof Function
                descriptorsString += `${indent}${indent}${stringKey}{ get:${get}, set:${set}, isMethod:${booleanSpacer(isMethod)}, configurable:${booleanSpacer(configurable)}, enumerable:${booleanSpacer(enumerable)}, writable:${booleanSpacer(writable)}, value: ${value} },\n`
            }
            return descriptorsString + `${indent}]`
        }

        const output = {
            valueItself: value,
            typeof: typeof value,
            constructorName: value.constructor instanceof Object && value.constructor.name,
            prototype: Object.getPrototypeOf(value),
            stringified: Error,
            instanceofObject: value instanceof Object,
            ifStatementTreatsAs: value ? true : false,
            doubleEqualToFalse: value == false,
            doubleEqualToTrue: value == false,
            objectIsFrozen: Object.isFrozen(value),
            isNaN: value !== value,
            isUndefined: false,
            isNull: false,
            doubleEqualToNull: value == null,
            tripleEqualToNull: value === null,
            valueOf: undefined,
            toString: undefined,
            isArray: value instanceof Array,
            iterableUsingForIn: false,
            iterableUsingForof: false,
            keys: JSON.stringify(Object.keys(value).map(each=>typeof each == 'symbol' ? `${each}` : each), indent.length*2),
            getOwnPropertyNames: JSON.stringify(Object.getOwnPropertyNames(value).map(each=>typeof each == 'symbol' ? `${each}` : each), indent.length*2),
            allPropertyDescriptions: getAllKeysDescriptionsAsString(value),
        }

        // 
        // valueOf
        // 
        if (value.valueOf instanceof Function) {
            output.valueOf = value.valueOf()
        }
        // 
        // toString
        // 
        if (value.toString instanceof Function) {
            output.toString = value.toString()
            if (typeof output.toString == 'string') {
                output.toString = JSON.stringify(output.toString)
            }
        }
        // 
        // stringify
        // 
        try {
            output.stringified = JSON.stringify(value)
        } catch (error) {
            output.stringified = error
        }

        // 
        // iterable
        // 
        try {
            for (const each in value) { break }
            output.iterableUsingForIn = true
        } catch (error) {}
        try {
            for (const each of value) { break }
            output.iterableUsingForOf = true
        } catch (error) {}

        return `
{
    valueItself: ${output.valueItself},
    typeof: ${output.typeof},
    constructorName: ${output.constructorName},
    prototype: ${output.prototype},
    stringified: ${output.stringified},
    instanceofObject: ${output.instanceofObject},
    ifStatementTreatsAs: ${output.ifStatementTreatsAs},
    doubleEqualToFalse: ${output.doubleEqualToFalse},
    doubleEqualToTrue: ${output.doubleEqualToTrue},
    objectIsFrozen: ${output.objectIsFrozen},
    isNaN: ${output.isNaN},
    isUndefined: ${output.isUndefined},
    isNull: ${output.isNull},
    doubleEqualToNull: ${output.doubleEqualToNull},
    tripleEqualToNull: ${output.tripleEqualToNull},
    valueOf: ${output.valueOf},
    toString: ${output.toString},
    isArray: ${output.isArray},
    iterableUsingForIn: ${output.iterableUsingForIn},
    iterableUsingForof: ${output.iterableUsingForof},
    keys: ${output.keys},
    getOwnPropertyNames: ${output.getOwnPropertyNames},
    allPropertyDescriptions: ${output.allPropertyDescriptions},
}
`
    }
}

module.exports = {
    debugValueAsString,
    debugValue,
    getAllKeysDescriptions,
    getAllKeys,
}