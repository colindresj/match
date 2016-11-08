/**
 * An implementation of closed pattern matching. It uses an algorithm based on
 * Clojure's core.match, which itself is based on Luc Maranget's paper
 * "Compiling Pattern Matching to Good Decision Trees".
 *
 * There are three main steps to this:
 *
 * 1. Convert the paramaters into a pattern matrix
 * 2. Compile the matrix to a directed acyclic graph
 * 3. Convert the graph into code
 *
 * Clause:
 * [[true, true, false], 'yes']
 */

export default function match(exp, clauses) {
  const matrix = emitMatrix(exp, clauses);
  const graph = compileGraph(matrix);

  return toCode(graph);
}
