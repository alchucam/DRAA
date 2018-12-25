
export var generationR = 0;
export var targetSequence = '';
var choice = ["A", "T", "G", "C"];


function mutated_gene(){
  return choice[Math.floor(Math.random()*4)];
}
function create_randomGene(length){
  var gnome = "";
  for(var i = 0;i<length;i++){
    gnome += mutated_gene();
  }
  return gnome;
}

//@length: length of the original
//crossover
function mate(parent1, parent2, original){
  var offspring= '';
  for (var i = 0; i < original.length; i++){
    // for better improvement.
    // if (parent1[i] === original[i] || parent2[i] === original[i]){
    //   offspring += (parent1[i] === original[i]) ? parent1[i] : parent2[i];
    // }
    var random = Math.floor(Math.random()*100)/100;

    if (random < 0.495){
      offspring += parent1[i];
    }
    else if (random < 0.99){
      offspring += parent2[i];
    }
    else{
      offspring += mutated_gene();
    }
  }


  return offspring;
}



var Indiv = function(gnome, fitness, original){
  this.gnome = gnome;
  this.fitness = fitness;
  this.original = original;

    this.calcFitness = function(original) {
      this.fitness = 0;
      for (var i = 0; i < original.length; i++){
        if (original[i] !== this.gnome[i]){
          this.fitness++;
        }
      }
  }
}



//genetic algorithm
//@original: original sequence before any mutation
//@sequence: current mutated sequence
export function repair(original, sequence){
  generationR = 0;
  targetSequence = sequence;
  var found = false;
  var i = 0;
  var population_size = 30;
  var population = [];

    population[0] = new Indiv(sequence, 0);
    for(i = 1; i < population_size; i++) {
      var tempGnome = create_randomGene(original.length);
      population[i] = new Indiv(tempGnome, 0);
    }

    for(i = 0; i < population_size; i++) {
      population[i].calcFitness(original);
    }

  while (!found){

    if (population[0].fitness === 0){
      found = true;
      break;
    }

    population.sort(function(a,b){
      if (a.fitness < b.fitness)
        return -1;
      else if (a.fitness > b.fitness)
        return 1;
      return 0;
    })

    var new_gen = [];
    //obtain 10% from the top 10% best fitness to go to next generation
    for (i = 0; i < (3); i++){
      new_gen.push(population[i]);
    }


    for (i = 3; i < population_size; i++){
      var random = Math.floor(Math.random()*10);
      var parent1 = population[random].gnome;
      random = Math.floor(Math.random()*10);
      var parent2 = population[random].gnome;

      var offspring = mate(parent1, parent2, original);
      new_gen[i] = new Indiv(offspring, 0);
      new_gen[i].calcFitness(original);
    }

    population = new_gen;
    generationR++;
    if (generationR >= 2000){
      found = true;
    }
  }
}
