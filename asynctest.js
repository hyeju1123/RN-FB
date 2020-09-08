async function delayFunction (getSec) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("Done!"), getSec)
    })

    let result = await promise;
    console.log(result);
    return result;
};


async function testAsync (time) {
    console.log("first");

    // delayFunction(time)
    //     .then(result => {
    //         alert(result);
    //         printSecond();
    //     })

    let result = await delayFunction(time);
    console.log(result);
    console.log("second");
}

// function printSecond () {
//     console.log("second")
// }

testAsync(2000);