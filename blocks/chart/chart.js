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

function renderStatic(block) {
  const rows = [...block.children];
  const pictures = [];
  let altText = '';

  rows.forEach((row) => {
    const img = row.querySelector('img');
    const pic = row.querySelector('picture');
    if (pic) {
      pictures.push(pic);
      const imgEl = pic.querySelector('img');
      if (imgEl && imgEl.alt) altText = imgEl.alt;
    } else if (img) {
      pictures.push(img);
      if (img.alt) altText = img.alt;
    }
  });

  if (!pictures.length) return;

  const figure = document.createElement('figure');
  figure.className = 'chart-figure';

  if (pictures.length === 1) {
    figure.append(pictures[0]);
  } else {
    const picture = document.createElement('picture');
    const desktopImg = pictures[0].querySelector('img') || pictures[0];
    const mobileSource = pictures[pictures.length - 1];
    const mobileSrc = mobileSource.querySelector('img')?.src || mobileSource.src;

    if (mobileSrc) {
      const source = document.createElement('source');
      source.setAttribute('media', '(max-width: 599px)');
      source.setAttribute('srcset', mobileSrc);
      picture.append(source);
    }

    if (pictures.length >= 3) {
      const tabletSource = pictures[1];
      const tabletSrc = tabletSource.querySelector('img')?.src || tabletSource.src;
      if (tabletSrc) {
        const source = document.createElement('source');
        source.setAttribute('media', '(max-width: 1023px)');
        source.setAttribute('srcset', tabletSrc);
        picture.append(source);
      }
    }

    const img = document.createElement('img');
    img.src = desktopImg.src || desktopImg.querySelector('img')?.src || '';
    img.alt = altText;
    img.loading = 'lazy';
    picture.append(img);
    figure.append(picture);
  }

  block.replaceChildren(figure);
}

function renderClinicalLineArea(block) {
  const configKeys = new Set([
    'xaxislabel', 'yaxislabel', 'xaxiscategories', 'yaxismax', 'yaxisstep', 'serieslabels', 'title',
  ]);
  const rows = [...block.children];
  const config = {};
  const dataPoints = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2) {
      const key = cells[0]?.textContent.trim().toLowerCase().replace(/\s+/g, '');
      const val = cells[1]?.textContent.trim();
      if (configKeys.has(key)) {
        config[key] = val;
        return;
      }
    }
    if (cells.length >= 3) {
      const label = cells[0]?.textContent.trim();
      const value = parseFloat(cells[1]?.textContent.trim());
      if (Number.isNaN(value)) return;
      const seriesIdx = parseInt(cells[2]?.textContent.trim(), 10) || 0;
      const calloutText = cells[3]?.textContent.trim() || '';
      const phaseLabel = cells[4]?.textContent.trim() || '';
      dataPoints.push({
        label, value, seriesIdx, calloutText, phaseLabel,
      });
    }
  });

  const xCategories = (config.xaxiscategories || '').split(',').map((s) => s.trim()).filter(Boolean);
  const yMax = parseFloat(config.yaxismax) || 100;
  const yStep = parseFloat(config.yaxisstep) || 20;
  const xAxisLabel = config.xaxislabel || '';
  const yAxisLabel = config.yaxislabel || '';
  const seriesLabels = (config.serieslabels || '').split(',').map((s) => s.trim()).filter(Boolean);

  if (!xCategories.length || !dataPoints.length) return;

  const ns = 'http://www.w3.org/2000/svg';
  const padLeft = 50;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 50;
  const width = 400;
  const height = 250;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', config.title || 'Clinical Line/Area Chart');
  svg.classList.add('chart-cla-svg');

  // Y-axis grid lines and labels
  for (let y = 0; y <= yMax; y += yStep) {
    const py = padTop + plotH - (y / yMax) * plotH;
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', padLeft);
    line.setAttribute('x2', padLeft + plotW);
    line.setAttribute('y1', py);
    line.setAttribute('y2', py);
    line.classList.add('chart-cla-grid');
    svg.append(line);

    const text = document.createElementNS(ns, 'text');
    text.setAttribute('x', padLeft - 8);
    text.setAttribute('y', py + 1.5);
    text.setAttribute('text-anchor', 'end');
    text.classList.add('chart-cla-y-label');
    text.textContent = y;
    svg.append(text);
  }

  // X-axis labels
  xCategories.forEach((cat, i) => {
    const px = padLeft + (i / (xCategories.length - 1)) * plotW;
    const text = document.createElementNS(ns, 'text');
    text.setAttribute('x', px);
    text.setAttribute('y', padTop + plotH + 18);
    text.setAttribute('text-anchor', 'middle');
    text.classList.add('chart-cla-x-label');
    text.textContent = cat;
    svg.append(text);
  });

  // Axis titles
  if (yAxisLabel) {
    const yt = document.createElementNS(ns, 'text');
    yt.setAttribute('x', 14);
    yt.setAttribute('y', padTop + plotH / 2);
    yt.setAttribute('text-anchor', 'middle');
    yt.setAttribute('transform', `rotate(-90, 14, ${padTop + plotH / 2})`);
    yt.classList.add('chart-cla-axis-title');
    yt.textContent = yAxisLabel;
    svg.append(yt);
  }
  if (xAxisLabel) {
    const xt = document.createElementNS(ns, 'text');
    xt.setAttribute('x', padLeft + plotW / 2);
    xt.setAttribute('y', height - 5);
    xt.setAttribute('text-anchor', 'middle');
    xt.classList.add('chart-cla-axis-title');
    xt.textContent = xAxisLabel;
    svg.append(xt);
  }

  // Group data by series
  const seriesMap = {};
  dataPoints.forEach((pt) => {
    if (!seriesMap[pt.seriesIdx]) seriesMap[pt.seriesIdx] = [];
    seriesMap[pt.seriesIdx].push(pt);
  });

  const xNumeric = xCategories.map((c) => parseFloat(c));
  const xMin = Math.min(...xNumeric);
  const xMax = Math.max(...xNumeric);

  function toSvgX(val) {
    return padLeft + ((val - xMin) / (xMax - xMin)) * plotW;
  }

  function toSvgY(val) {
    return padTop + plotH - (val / yMax) * plotH;
  }

  // Render each series
  Object.keys(seriesMap).sort().forEach((sIdx) => {
    const points = seriesMap[sIdx].sort((a, b) => {
      const ax = parseFloat(a.label);
      const bx = parseFloat(b.label);
      return ax - bx;
    });

    const pathPoints = points.map((pt) => {
      const x = toSvgX(parseFloat(pt.label));
      const y = toSvgY(pt.value);
      return { x, y, pt };
    });

    if (pathPoints.length < 2) return;

    const areaD = `M${pathPoints[0].x},${toSvgY(0)} ${pathPoints.map((p) => `L${p.x},${p.y}`).join(' ')} L${pathPoints[pathPoints.length - 1].x},${toSvgY(0)} Z`;
    const area = document.createElementNS(ns, 'path');
    area.setAttribute('d', areaD);
    area.classList.add('chart-cla-area', `chart-cla-series-${sIdx}`);
    svg.append(area);

    // Line
    const lineD = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const line = document.createElementNS(ns, 'path');
    line.setAttribute('d', lineD);
    line.classList.add('chart-cla-line', `chart-cla-series-${sIdx}`);
    svg.append(line);

    // Data points and callouts
    pathPoints.forEach((p) => {
      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', p.x);
      circle.setAttribute('cy', p.y);
      circle.setAttribute('r', 3);
      circle.classList.add('chart-cla-point', `chart-cla-series-${sIdx}`);
      svg.append(circle);

      if (p.pt.calloutText) {
        const g = document.createElementNS(ns, 'g');
        g.classList.add('chart-cla-callout');
        const rect = document.createElementNS(ns, 'rect');
        rect.setAttribute('x', p.x - 18);
        rect.setAttribute('y', p.y - 28);
        rect.setAttribute('width', 36);
        rect.setAttribute('height', 18);
        rect.setAttribute('rx', 4);
        rect.classList.add('chart-cla-callout-box', `chart-cla-series-${sIdx}`);
        g.append(rect);
        const txt = document.createElementNS(ns, 'text');
        txt.setAttribute('x', p.x);
        txt.setAttribute('y', p.y - 16);
        txt.setAttribute('text-anchor', 'middle');
        txt.classList.add('chart-cla-callout-label');
        txt.textContent = p.pt.calloutText;
        g.append(txt);
        svg.append(g);
      }

      if (p.pt.phaseLabel) {
        const pl = document.createElementNS(ns, 'line');
        pl.setAttribute('x1', p.x);
        pl.setAttribute('x2', p.x);
        pl.setAttribute('y1', padTop);
        pl.setAttribute('y2', padTop + plotH);
        pl.classList.add('chart-cla-phase-line');
        svg.append(pl);
        const pt2 = document.createElementNS(ns, 'text');
        pt2.setAttribute('x', p.x + 4);
        pt2.setAttribute('y', padTop + 10);
        pt2.classList.add('chart-cla-phase-label');
        pt2.textContent = p.pt.phaseLabel;
        svg.append(pt2);
      }
    });
  });

  // Legend
  const legend = document.createElement('div');
  legend.className = 'chart-cla-legend';
  seriesLabels.forEach((lbl, i) => {
    const item = document.createElement('span');
    item.className = `chart-cla-legend-item chart-cla-legend-series-${i}`;
    item.innerHTML = `<span class="chart-cla-legend-dot chart-cla-series-${i}"></span>${lbl}`;
    legend.append(item);
  });

  // Accessible table
  const table = document.createElement('table');
  table.className = 'chart-data-table visually-hidden';
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr><th>X</th>${seriesLabels.map((l) => `<th>${l}</th>`).join('')}</tr>`;
  table.append(thead);
  const tbody = document.createElement('tbody');
  xCategories.forEach((cat) => {
    const tr = document.createElement('tr');
    let cells = `<td>${cat}</td>`;
    Object.keys(seriesMap).sort().forEach((sIdx) => {
      const pt = seriesMap[sIdx]?.find((p) => p.label === cat);
      cells += `<td>${pt ? pt.value : ''}</td>`;
    });
    tr.innerHTML = cells;
    tbody.append(tr);
  });
  table.append(tbody);

  block.replaceChildren(svg, legend, table);

  // Scroll-triggered animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        block.classList.add('chart-cla-animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(block);
}

export default function decorate(block) {
  const isUeEdit = document.body.classList.contains('adobe-ue-edit')
    || document.querySelector('.adobe-ue-edit') !== null;
  if (isUeEdit) {
    block.classList.add('chart--editor');
    return;
  }

  const isStatic = block.classList.contains('static');
  if (isStatic) {
    renderStatic(block);
    return;
  }

  const isClinicalLineArea = block.classList.contains('clinical-line-area');
  if (isClinicalLineArea) {
    renderClinicalLineArea(block);
    return;
  }

  const isPie = block.classList.contains('pie');

  const rows = [...block.children];
  const data = rows.map((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return null;
    const val = parseFloat(cells[1]?.textContent.trim());
    if (Number.isNaN(val)) return null;
    return {
      label: cells[0]?.textContent.trim() || '',
      value: val,
      valueLabel: cells[2]?.textContent.trim() || '',
    };
  }).filter(Boolean);

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

  const table = document.createElement('table');
  table.className = 'chart-data-table visually-hidden';
  data.forEach((d) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${d.label}</td><td>${d.valueLabel || d.value}</td>`;
    table.append(tr);
  });

  block.replaceChildren(svg, table);
}
