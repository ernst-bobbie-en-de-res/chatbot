const tf = require('@tensorflow/tfjs');
// require('@tensorflow/tfjs-node');

class AI {
    //Compile model
    compile() {
        const model = tf.sequential();

        //Input layer
        model.add(tf.layers.dense({
            units: 3,
            inputShape: [3]
        }));

        //Output layer
        model.add(tf.layers.dense({
            units: 2
        }));

        model.compile({
            loss: 'meanSquaredError',
            optimizer: 'sgd'
        });

        return model;
    }

    //Run model
    run() {
        const model = this.compile();

        //Input layer
        const i = tf.tensor2d([
            [0.1, 0.2, 2],
            [1, 0.2, 0.5],
            [0.1, 1, 0.3]
        ]);

        //Output layer
        const o = tf.tensor2d([
            [1, 0],
            [0, 1],
            [1, 1]
        ]);

        //Epochs = aantal iteraties
        model.fit(i, o, {
            epochs: 100000
        }).then(() => {
            const data = tf.tensor2d([
                [1.0, 1.0, 1.0]
            ]);

            const prediction = model.predict(data);
            prediction.print();
        });
    }
}

const ai = new AI();
ai.run();