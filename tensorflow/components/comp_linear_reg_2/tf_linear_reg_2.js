/**
 * @file 
 * Predicts y value of a simple linear regression
 *
 */

 (function ($, Drupal, window, document) {
  
  async function doTraining(model, xs, ys, num_epochs, fitCallbacks) {
    const history =
      await model.fit(xs, ys,
        {
          epochs: num_epochs,
          callbacks: fitCallbacks
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
        
        // Get number of epochs from configuration
        const elem = document.querySelector(
          '.block-componentcomp-linear-reg-2 .content .comp_linear_reg_2'
        );
        const config = { ...elem.dataset};
        console.log(config);
        const num_epochs = config.epochs;

        console.log("epochs = " + num_epochs);

        // setup tsjs-vis
       
        // Data definition
        const values = [
          [{x: -1, y: -3}, {x: 0, y: -1}, {x: 1, y: 2}, {x: 2, y: 3}, {x: 3, y: 5}, {x: 5, y: 7}]
        ];
        series = ['Values'];
        const surface = tfvis.visor().surface({
          name: 'Model Training',
          tab: 'Scatterplot'
        });
        
        // Setup scatterplot
        tfvis.render.scatterplot(surface, {values, series}, {
          width: 400,
          xLabel: 'My x values',
          yLabel: 'My y values',
          xAxisDomain: ([-6, 10]),
          yAxisDomain: ([-6, 10])
        });

        // Set up training history
        const metrics = ['loss', 'acc'];
        const container = { 
          name: 'Model Training', 
          tab: 'History',
          styles: { 
               height: '1000px' 
          }};

        // Show model summary  
        tfvis.show.modelSummary(container, model);

        // Define callback to show history at the end of each epoch
        const fitCallbacks = tfvis.show.fitCallbacks(container, metrics)

        // Training and Prediction
        doTraining(model, xs, ys, num_epochs, fitCallbacks).then(() => {
          console.log('Y = ' + model.predict(tf.tensor2d([10], [1, 1])));
         
          for (let i = 0; i < model.getWeights().length; i++) {
            console.log(model.getWeights()[i].dataSync());
          }
        });
      });

    }
  };
}(jQuery, Drupal, this, this.document));
