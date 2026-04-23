function renderBar(data, svg) {
  const max = Math.max(...data.map((d) => d.value));
  const barW = 100 / data.length;

  data.forEach((d, i) => {
    const pct = (d.value / max) * 100;
    const x = i * barW + barW * 0.1;
    const w = barW * 0.8;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', `${x}%`);
    rect.setAttribute('y', `${100 - pct}%`);
    rect.setAttribute('width', `${w}%`);
    rect.setAttribute('height', `${pct}%`);
    rect.classList.add('chart-bar-rect');
    svg.append(rect);

    if (d.valueLabel) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', `${x + w / 2}%`);
      text.setAttribute('y', `${100 - pct - 2}%`);
      text.setAttribute('text-anchor', 'middle');
      text.classList.add('chart-value-label');
      text.textContent = d.valueLabel;
      svg.append(text);
    }

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', `${x + w / 2}%`);
    label.setAttribute('y', '102%');
    label.setAttribute('text-anchor', 'middle');
    label.classList.add('chart-axis-label');
    label.textContent = d.label;
    svg.append(label);
  });
}

function renderPie(data, svg) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let startAngle = -Math.PI / 2;
  const cx = 50;
  const cy = 50;
  const r = 40;

  data.forEach((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`);
    path.classList.add('chart-pie-slice', `chart-slice-${i}`);
    svg.append(path);
    startAngle = endAngle;
  });
}

export default function decorate(block) {
  const isPie = block.classList.contains('pie');

  const rows = [...block.children];
  const data = rows.map((row) => {
    const cells = [...row.children];
    return {
      label: cells[0]?.textContent.trim() || '',
      value: parseFloat(cells[1]?.textContent.trim() || '0'),
      valueLabel: cells[2]?.textContent.trim() || '',
    };
  }).filter((d) => !Number.isNaN(d.value));

  if (!data.length) return;

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Chart');
  svg.classList.add('chart-svg');

  if (isPie) {
    svg.setAttribute('viewBox', '0 0 100 100');
    renderPie(data, svg);
  } else {
    svg.setAttribute('viewBox', '0 0 100 110');
    svg.setAttribute('preserveAspectRatio', 'none');
    renderBar(data, svg);
  }

  // Accessible table fallback
  const table = document.createElement('table');
  table.className = 'chart-data-table visually-hidden';
  data.forEach((d) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${d.label}</td><td>${d.valueLabel || d.value}</td>`;
    table.append(tr);
  });

  block.replaceChildren(svg, table);
}
