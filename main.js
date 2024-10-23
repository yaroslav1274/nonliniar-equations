const aV = document.querySelector('#a');
const bV = document.querySelector('#b');
const epsV = document.querySelector('#eps');
const kMaxV = document.querySelector('#kmax');
const method = document.querySelector('#method');
const equation = document.querySelector('#equation');
const rootV = document.querySelector('#root');
const iterationCount = document.querySelector('#iterations');
const solveBtn = document.querySelector('#solve');
const clearBtn = document.querySelector('#clear');
const kMaxBox = document.querySelector('#kmax-box'); // For toggling display

let a, b, kMax, m, k;

function f(x, k1) {
  let result;
  switch (k1) {
    case 0:
      result = x * x - 4;
      break;
    case 1:
      result = Math.sin(x) - 0.5;
      break;
  }
  return result;
}

function fp(x, d, k1) {
  let result = (f(x + d, k1) - f(x, k1)) / d;
  return result;
}

function f2p(x, d, k1) {
  let result = (f(x + d, k1) + f(x - d, k1) - 2 * f(x, k1)) / (d * d);
  return result;
}

function MDP(a, b, eps, k1) {
  let c, Fc;
  let iterations = 0;
  while (b - a > eps) {
    c = 0.5 * (b - a) + a;
    iterations += 1;
    Fc = f(c, k1);
    if (Math.abs(Fc) < eps) return { root: c, iterations };
    else if (f(a, k1) * Fc > 0) a = c;
    else b = c;
  }
  return { root: c, iterations };
}

function MN(a, b, eps, k1, kMax) {
  let x, Dx, D, i;
  Dx = 0.0;
  D = eps / 100.0;
  x = b;
  let iterations = 0;
  
  if ((f(x, k1) * f2p(x, D, k1)) < 0) x = a;
  else if ((f(x, k1) * f2p(x, D, k1)) < 0)
    alert('Для цього рівняння збіжність ітерацій не гарантована');

  for (i = 1; i <= kMax; i++) {
    Dx = f(x, k1) / fp(x, D, k1);
    x -= Dx;
    iterations = i;
    if (Math.abs(Dx) < eps) {
      return { root: x, iterations };
    }
  }
  alert('За задану кількість ітерацій кореня не знайдено');
  return { root: x, iterations };
}

solveBtn.addEventListener('click', () => {
  const aVal = parseFloat(aV.value);
  const bVal = parseFloat(bV.value);
  const epsVal = parseFloat(epsV.value);
  const kMaxVal = parseFloat(kMaxV.value);

  let result;
  
  if (isNaN(aVal)) {
    alert('Введіть значення a');
    return;
  }
  if (isNaN(bVal)) {
    alert('Введіть значення b');
    return;
  }
  if (isNaN(epsVal)) {
    alert('Введіть значення Eps');
    return;
  }

  if (aVal > bVal) {
    const temp = aVal;
    a = bVal;
    b = temp;
  } else {
    a = aVal;
    b = bVal;
  }

  switch (method.children[method.selectedIndex].value) {
    case 'bisection':
      m = 0;
      break;
    case 'newton':
      m = 1;
      break;
  }

  switch (equation.children[equation.selectedIndex].value) {
    case 'square':
      k = 0;
      break;
    case 'sine':
      k = 1;
      break;
  }

  if (m === 0) {
    if (f(a, k) * f(b, k) > 0) {
      alert('Введіть правильний інтервал [a, b]!');
      return;
    }
    result = MDP(a, b, epsVal, k);
  } else {
    kMax = parseInt(kMaxVal);
    result = MN(a, b, epsVal, k, kMax);
  }

  rootV.value = result.root.toString();
  iterationCount.value = result.iterations.toString();
});

clearBtn.addEventListener('click', () => {
  aV.value = '';
  bV.value = '';
  epsV.value = '';
  kMaxV.value = '';
  rootV.value = '';
  iterationCount.value = '';
  updateKmaxVisibility();
});

function updateKmaxVisibility() {
  if (method.value === 'bisection') {
    kMaxBox.style.display = 'none';
  } else if (method.value === 'newton') {
    kMaxBox.style.display = 'block';
  }
}

method.addEventListener('change', updateKmaxVisibility);

updateKmaxVisibility();