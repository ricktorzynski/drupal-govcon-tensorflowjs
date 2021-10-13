/**
 * @file 
 * Predicts y value of a simple linear regression
 *
 */

(function ($, Drupal, window, document) {
  
  async function doTraining(model, xs, ys) {
    const history =
      await model.fit(xs, ys,
        {
          epochs: 50,
          callbacks: {
            onEpochEnd: async (epoch, logs) => {
              console.log("Epoch:"
                + epoch
                + " Loss:"
                + logs.loss);
            }
          }
        });
  }

  Drupal.behaviors.tfTraining = {
    attach: function (context, settings) {
      
      $('#predict').once().click(function () {
        // Data definition and preprocessing
        const xs = tf.tensor2d([-1.0, 0.0, 1.0, 2.0, 3.0, 4.0], [6, 1]);
        const ys = tf.tensor2d([-3.0, -1.0, 2.0, 3.0, 5.0, 7.0], [6, 1]);

        // Define model
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
        model.compile({
          loss: 'meanSquaredError',
          optimizer: 'sgd'
        });
        model.summary();
        
        // Training and Prediction
        doTraining(model, xs, ys).then(() => {
          console.log('Y = ' + model.predict(tf.tensor2d([10], [1, 1])));
          for (let i = 0; i < model.getWeights().length; i++) {
            console.log(model.getWeights()[i].dataSync());
          }
        });
      });

    }
  };
}(jQuery, Drupal, this, this.document));
