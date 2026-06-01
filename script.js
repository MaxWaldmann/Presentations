// ==========================================================================
// 1. НАВІГАЦІЯ ТА КЕРУВАННЯ ПРЕЗЕНТАЦІЄЮ (14 СЛАЙДІВ)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const totalSlidesNum = document.getElementById('total-slides-num');
  const currentSlideNum = document.getElementById('current-slide-num');
  const slideTitleDisplay = document.getElementById('slide-title-display');
  const progressBar = document.getElementById('progress-bar');
  const dotsContainer = document.getElementById('presentation-dots');
  const slideListLinks = document.getElementById('slide-list-links');
  
  const sidebarMenu = document.getElementById('sidebar-menu');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  
  const btnPrev = document.getElementById('control-prev');
  const btnNext = document.getElementById('control-next');
  
  let currentSlide = 0;
  totalSlidesNum.textContent = slides.length;

  // Ініціалізація точок та бокового меню
  slides.forEach((slide, index) => {
    // Створення навігаційних точок (dots)
    const dot = document.createElement('div');
    dot.classList.add('dot-indicator');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);

    // Створення елементів списку в меню
    const title = slide.getAttribute('data-title') || `Слайд ${index + 1}`;
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${title}`;
    if (index === 0) li.classList.add('active');
    li.addEventListener('click', () => {
      goToSlide(index);
      closeMenu();
    });
    slideListLinks.appendChild(li);
  });

  const dotIndicators = document.querySelectorAll('.dot-indicator');
  const sidebarLinks = document.querySelectorAll('.slide-list li');

  function updateNavigationUI() {
    currentSlideNum.textContent = currentSlide + 1;
    const activeSlide = slides[currentSlide];
    slideTitleDisplay.textContent = activeSlide.getAttribute('data-title') || 'Презентація';
    
    // Прогрес-бар
    const progressPercent = ((currentSlide) / (slides.length - 1)) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Стан кнопок
    btnPrev.disabled = currentSlide === 0;
    
    if (currentSlide === slides.length - 1) {
      btnNext.innerHTML = `<span>Завершити</span><span class="material-symbols-outlined">restart_alt</span>`;
    } else {
      btnNext.innerHTML = `<span>Далі</span><span class="material-symbols-outlined">arrow_forward</span>`;
    }

    // Точки та бокове меню
    dotIndicators.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
    
    sidebarLinks.forEach((link, idx) => {
      link.classList.toggle('active', idx === currentSlide);
    });

    // Зупиняємо анімації симулятора, якщо користувач пішов зі слайдів візуалізації (слайд 6 -> індекс 5, слайд 11 -> індекс 10)
    if (currentSlide !== 5 && window.visS6) {
      window.visS6.stopSimulation();
    } else if (currentSlide === 5 && window.visS6) {
      window.visS6.draw();
    }

    if (currentSlide !== 10 && window.visS11) {
      window.visS11.stopSimulation();
    } else if (currentSlide === 10 && window.visS11) {
      window.visS11.draw();
    }
  }

  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    slides[currentSlide].classList.remove('active');
    if (index > currentSlide) {
      slides[currentSlide].classList.add('prev-slide');
      slides[currentSlide].classList.remove('next-slide');
    } else {
      slides[currentSlide].classList.add('next-slide');
      slides[currentSlide].classList.remove('prev-slide');
    }

    currentSlide = index;
    
    slides[currentSlide].classList.remove('prev-slide', 'next-slide');
    slides[currentSlide].classList.add('active');
    
    updateNavigationUI();
    window.location.hash = `slide-${currentSlide + 1}`;
  }

  function nextSlide() {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(0); // Перезапуск
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }

  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);
  
  // Кнопка на титульному
  const startBtn = document.querySelector('.next-slide-btn');
  if (startBtn) {
    startBtn.addEventListener('click', nextSlide);
  }
  
  // Обробка клавіш
  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      return;
    }
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  });

  // Логіка швидкого меню
  function openMenu() {
    sidebarMenu.classList.add('open');
    sidebarOverlay.classList.add('active');
  }

  function closeMenu() {
    sidebarMenu.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  sidebarOverlay.addEventListener('click', closeMenu);

  // Перевірка хешу в URL
  if (window.location.hash) {
    const hash = window.location.hash;
    const slideMatch = hash.match(/slide-(\d+)/);
    if (slideMatch && slideMatch[1]) {
      const slideNum = parseInt(slideMatch[1], 10) - 1;
      if (slideNum >= 0 && slideNum < slides.length) {
        slides[currentSlide].classList.remove('active');
        currentSlide = slideNum;
        slides[currentSlide].classList.add('active');
        updateNavigationUI();
      }
    }
  }

  // ==========================================================================
  // 2. ВКЛАДКИ ПРАКТИКИ (КОД / КОМПІЛЯТОР НА ВЕСЬ ЕКРАН)
  // ==========================================================================
  const compilerTabBtns = document.querySelectorAll('.compiler-tab-btn');
  compilerTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      const container = btn.closest('.compiler-tabs-container');
      
      container.querySelectorAll('.compiler-tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.compiler-tab-panel').forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const panel = document.getElementById(targetId);
      if (panel) {
        panel.classList.add('active');
      }
    });
  });

  // Ініціалізація симуляторів графів
  initSimulators();
  initFlowchartPanAndZoom();
});

// Глобальна функція для відкриття додаткової інформації вчених
function toggleBio(element) {
  const wrapper = element.closest('.expandable-bio');
  wrapper.classList.toggle('active-expanded');
  
  // Зміна іконки розгортання
  const icon = element.querySelector('.material-symbols-outlined:last-child');
  if (icon) {
    icon.textContent = wrapper.classList.contains('active-expanded') ? 'expand_less' : 'expand_more';
  }
}


// ==========================================================================
// 3. ІНТЕРАКТИВНИЙ РУШІЙ ГРАФІВ (CANVAS)
// ==========================================================================

class GraphVisualizer {
  constructor(canvasId, suffix, defaultPreset = 'simple') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.suffix = suffix;
    this.defaultPreset = defaultPreset;
    
    this.nodes = [];
    this.edges = [];
    this.startNodeId = null;
    
    // Стани конструктора
    this.activeTool = 'drag'; // drag, node, edge, delete
    this.selectedNodeId = null;
    this.draggedNodeId = null;
    this.dragOffset = { x: 0, y: 0 };
    
    this.nodeRadius = 24;
    
    // Симуляція
    this.trace = [];
    this.stepIndex = 0;
    this.timer = null;

    this.setupDOMReferences();
    this.setupListeners();
    this.loadPreset(this.defaultPreset);
  }

  setupDOMReferences() {
    this.presetSelect = document.getElementById(`presets-select-${this.suffix}`);
    this.startNodeLabel = document.getElementById(`demo-start-node-${this.suffix}`);
    this.playBtn = document.getElementById(`btn-demo-play-${this.suffix}`);
    this.nextBtn = document.getElementById(`btn-demo-next-${this.suffix}`);
    this.prevBtn = document.getElementById(`btn-demo-prev-${this.suffix}`);
    this.resetBtn = document.getElementById(`btn-demo-reset-${this.suffix}`);
    this.speedRange = document.getElementById(`speed-range-${this.suffix}`);
    this.queueDisplay = document.getElementById(`demo-queue-list-${this.suffix}`);
    this.stateTableBody = document.querySelector(`#demo-state-table-${this.suffix} tbody`);
    this.statusLog = document.getElementById(`demo-status-log-${this.suffix}`);
    this.modeIndicator = document.getElementById(`canvas-mode-indicator-${this.suffix}`);
  }

  setupListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
    this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));

    // Кнопки панелі Canvas
    const clearBtn = document.getElementById(`btn-demo-clear-${this.suffix}`);
    if (clearBtn) clearBtn.addEventListener('click', () => this.clear());
    
    const setStartBtn = document.getElementById(`btn-demo-set-start-${this.suffix}`);
    if (setStartBtn) setStartBtn.addEventListener('click', () => this.promptSetStartNode());
    
    if (this.resetBtn) this.resetBtn.addEventListener('click', () => this.resetSimulationState());

    // Обробка пресетів
    if (this.presetSelect) {
      this.presetSelect.addEventListener('change', (e) => this.loadPreset(e.target.value));
    }

    // Редактор графа (інструменти)
    const tools = ['drag', 'node', 'edge', 'delete'];
    tools.forEach(tool => {
      const btn = document.getElementById(`tool-${tool}-${this.suffix}`);
      if (btn) {
        btn.addEventListener('click', () => {
          tools.forEach(t => {
            const b = document.getElementById(`tool-${t}-${this.suffix}`);
            if (b) b.classList.remove('active');
          });
          btn.classList.add('active');
          this.activeTool = tool;

          const labels = {
            'drag': 'Режим: Перетягування вузлів',
            'node': 'Режим: Додавання вершин (клікніть на полі)',
            'edge': 'Режим: Додавання ребер (клікніть першу, потім другу)',
            'delete': 'Режим: Видалення вершин/ребер'
          };
          if (this.modeIndicator) this.modeIndicator.textContent = labels[tool];

          this.cancelEdgeSelection();
        });
      }
    });

    // Контролери кроків симуляції
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.stepForward());
    }
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.stepBackward());
    }
  }

  getMouseCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  getNodeAt(x, y) {
    return this.nodes.find(node => Math.hypot(node.x - x, node.y - y) <= this.nodeRadius + 6);
  }

  getEdgeAt(x, y) {
    return this.edges.find(edge => {
      const fromNode = this.nodes.find(n => n.id === edge.from);
      const toNode = this.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return false;
      
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      return Math.hypot(midX - x, midY - y) <= 22;
    });
  }

  handleMouseDown(e) {
    const coords = this.getMouseCoords(e);
    const clickedNode = this.getNodeAt(coords.x, coords.y);

    if (this.activeTool === 'drag') {
      if (clickedNode) {
        this.draggedNodeId = clickedNode.id;
        this.dragOffset = {
          x: coords.x - clickedNode.x,
          y: coords.y - clickedNode.y
        };
      }
    } else if (this.activeTool === 'node') {
      if (!clickedNode) {
        const label = prompt("Введіть назву міста/вершини:", this.getNextNodeLabel());
        if (label) {
          const id = Date.now().toString();
          this.nodes.push({
            id: id,
            name: label.substring(0, 12).trim(),
            x: coords.x,
            y: coords.y,
            dist: Infinity,
            parent: null,
            isVisited: false,
            isActive: false,
            isProcessing: false
          });
          if (this.nodes.length === 1) {
            this.startNodeId = id;
          }
          this.stopSimulation();
          this.draw();
          this.triggerGraphChange();
        }
      }
    } else if (this.activeTool === 'edge') {
      if (clickedNode) {
        if (!this.selectedNodeId) {
          this.selectedNodeId = clickedNode.id;
          clickedNode.isActive = true;
          this.draw();
        } else {
          if (this.selectedNodeId !== clickedNode.id) {
            const exists = this.edges.some(edge => 
              edge.from === this.selectedNodeId && edge.to === clickedNode.id
            );
            if (!exists) {
              const weightStr = prompt("Введіть вагу дороги (ціле число, допускається негативне):", "5");
              const weight = parseInt(weightStr, 10);
              if (!isNaN(weight)) {
                this.edges.push({
                  from: this.selectedNodeId,
                  to: clickedNode.id,
                  weight: weight,
                  isActive: false,
                  isOptimal: false,
                  isRelaxing: false
                });
                this.stopSimulation();
                this.triggerGraphChange();
              }
            } else {
              alert("Така дорога вже існує!");
            }
          }
          this.cancelEdgeSelection();
        }
      } else {
        this.cancelEdgeSelection();
      }
    } else if (this.activeTool === 'delete') {
      if (clickedNode) {
        this.nodes = this.nodes.filter(n => n.id !== clickedNode.id);
        this.edges = this.edges.filter(e => e.from !== clickedNode.id && e.to !== clickedNode.id);
        if (this.startNodeId === clickedNode.id) {
          this.startNodeId = this.nodes.length > 0 ? this.nodes[0].id : null;
        }
        this.stopSimulation();
        this.draw();
        this.triggerGraphChange();
      } else {
        const clickedEdge = this.getEdgeAt(coords.x, coords.y);
        if (clickedEdge) {
          this.edges = this.edges.filter(e => e !== clickedEdge);
          this.stopSimulation();
          this.draw();
          this.triggerGraphChange();
        }
      }
    }
  }

  handleMouseMove(e) {
    if (this.activeTool === 'drag' && this.draggedNodeId) {
      const coords = this.getMouseCoords(e);
      const node = this.nodes.find(n => n.id === this.draggedNodeId);
      if (node) {
        node.x = Math.max(this.nodeRadius, Math.min(this.canvas.width - this.nodeRadius, coords.x - this.dragOffset.x));
        node.y = Math.max(this.nodeRadius, Math.min(this.canvas.height - this.nodeRadius, coords.y - this.dragOffset.y));
        this.draw();
      }
    }
  }

  handleMouseUp() {
    if (this.draggedNodeId) {
      this.draggedNodeId = null;
      this.triggerGraphChange();
    }
  }

  handleDoubleClick(e) {
    const coords = this.getMouseCoords(e);
    const clickedEdge = this.getEdgeAt(coords.x, coords.y);
    if (clickedEdge) {
      const weightStr = prompt(`Змінити вагу ребра з ${clickedEdge.weight} на:`, clickedEdge.weight.toString());
      const weight = parseInt(weightStr, 10);
      if (!isNaN(weight)) {
        clickedEdge.weight = weight;
        this.stopSimulation();
        this.draw();
        this.triggerGraphChange();
      }
    }
  }

  cancelEdgeSelection() {
    if (this.selectedNodeId) {
      const selNode = this.nodes.find(n => n.id === this.selectedNodeId);
      if (selNode) selNode.isActive = false;
      this.selectedNodeId = null;
      this.draw();
    }
  }

  getNextNodeLabel() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < alphabet.length; i++) {
      if (!this.nodes.some(n => n.name === alphabet[i])) return alphabet[i];
    }
    return `V${this.nodes.length + 1}`;
  }

  clear() {
    this.nodes = [];
    this.edges = [];
    this.startNodeId = null;
    this.cancelEdgeSelection();
    this.resetSimulationState();
    this.draw();
    this.triggerGraphChange();
  }

  triggerGraphChange() {
    const startNode = this.nodes.find(n => n.id === this.startNodeId);
    if (this.startNodeLabel) {
      this.startNodeLabel.textContent = startNode ? startNode.name : '-';
    }
    this.resetSimulationState();
  }

  promptSetStartNode() {
    const name = prompt("Введіть назву стартової вершини:");
    if (name) {
      const node = this.nodes.find(n => n.name.toLowerCase() === name.trim().toLowerCase());
      if (node) {
        this.startNodeId = node.id;
        this.stopSimulation();
        this.triggerGraphChange();
        this.draw();
      } else {
        alert("Вершину не знайдено!");
      }
    }
  }

  loadPreset(presetType) {
    this.clear();
    
    if (presetType === 'simple') {
      this.nodes = [
        { id: 'A', name: 'A', x: 120, y: 250, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'B', name: 'B', x: 280, y: 130, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'C', name: 'C', x: 280, y: 370, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'D', name: 'D', x: 480, y: 130, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'E', name: 'E', x: 480, y: 370, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'F', name: 'F', x: 660, y: 250, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false }
      ];
      this.edges = [
        { from: 'A', to: 'B', weight: 4, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'A', to: 'C', weight: 2, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'B', to: 'C', weight: 1, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'B', to: 'D', weight: 5, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'C', to: 'D', weight: 8, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'C', to: 'E', weight: 10, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'D', to: 'E', weight: 2, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'D', to: 'F', weight: 6, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'E', to: 'F', weight: 3, isActive: false, isOptimal: false, isRelaxing: false }
      ];
      this.startNodeId = 'A';
      
    } else if (presetType === 'negative') {
      this.nodes = [
        { id: 'S', name: 'S', x: 120, y: 250, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'A', name: 'A', x: 300, y: 130, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'B', name: 'B', x: 300, y: 370, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'C', name: 'C', x: 500, y: 250, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false }
      ];
      this.edges = [
        { from: 'S', to: 'A', weight: 6, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'S', to: 'B', weight: 7, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'A', to: 'C', weight: 5, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'B', to: 'A', weight: 8, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'B', to: 'C', weight: 2, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'A', to: 'B', weight: -4, isActive: false, isOptimal: false, isRelaxing: false }
      ];
      this.startNodeId = 'S';
      
    } else if (presetType === 'neg-cycle') {
      this.nodes = [
        { id: 'A', name: 'A', x: 150, y: 250, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'B', name: 'B', x: 350, y: 140, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'C', name: 'C', x: 350, y: 360, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'D', name: 'D', x: 550, y: 250, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false }
      ];
      this.edges = [
        { from: 'A', to: 'B', weight: 4, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'B', to: 'C', weight: -5, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'C', to: 'B', weight: 2, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'C', to: 'D', weight: 3, isActive: false, isOptimal: false, isRelaxing: false }
      ];
      this.startNodeId = 'A';
      
    } else if (presetType === 'ukraine') {
      this.nodes = [
        { id: 'L', name: 'Львів', x: 120, y: 250, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'I', name: 'Ів.-Фр.', x: 160, y: 380, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'K', name: 'Київ', x: 400, y: 160, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'O', name: 'Одеса', x: 430, y: 410, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'D', name: 'Дніпро', x: 620, y: 310, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false },
        { id: 'H', name: 'Харків', x: 710, y: 150, dist: Infinity, parent: null, isVisited: false, isActive: false, isProcessing: false }
      ];
      this.edges = [
        { from: 'L', to: 'K', weight: 5, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'L', to: 'I', weight: 1, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'I', to: 'O', weight: 5, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'K', to: 'O', weight: 4, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'K', to: 'D', weight: 4, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'K', to: 'H', weight: 4, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'D', to: 'O', weight: 3, isActive: false, isOptimal: false, isRelaxing: false },
        { from: 'D', to: 'H', weight: 2, isActive: false, isOptimal: false, isRelaxing: false }
      ];
      this.startNodeId = 'L';
    }
    
    this.draw();
    this.triggerGraphChange();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.edges.forEach(edge => this.drawEdge(edge));
    this.nodes.forEach(node => this.drawNode(node));
  }

  drawGrid() {
    this.ctx.strokeStyle = '#1d1a24';
    this.ctx.lineWidth = 1;
    const gridSize = 40;
    
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  drawNode(node) {
    const isStart = node.id === this.startNodeId;
    this.ctx.save();
    
    let fillColor = '#17151e';
    let strokeColor = '#3a3447';
    let lineWidth = 2;
    let textColor = '#e6e1e6';

    if (node.isVisited) {
      fillColor = 'rgba(52, 211, 153, 0.1)';
      strokeColor = '#1e8e3e';
    }
    
    if (node.isActive) {
      fillColor = 'rgba(208, 188, 255, 0.1)';
      strokeColor = '#d0bcff';
      lineWidth = 3;
    }
    
    if (node.isProcessing) {
      fillColor = 'rgba(249, 171, 0, 0.1)';
      strokeColor = '#f9ab00';
      lineWidth = 3;
    }

    if (isStart) {
      strokeColor = '#d0bcff';
      lineWidth = 3;
    }

    // Тінь
    this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
    this.ctx.shadowBlur = 8;
    this.ctx.shadowOffsetY = 3;
    
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    
    this.ctx.shadowColor = 'transparent';
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();

    // Текст
    this.ctx.font = 'bold 12px "Outfit"';
    this.ctx.fillStyle = textColor;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const isLongName = node.name.length > 2;
    const displayName = isLongName ? node.name.substring(0, 1) : node.name;
    this.ctx.fillText(displayName, node.x, node.y);

    if (isLongName) {
      this.ctx.font = 'bold 10px "Outfit"';
      this.ctx.fillStyle = '#b3afc1';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText(node.name, node.x, node.y + this.nodeRadius + 4);
    }

    // Позначка джерела
    if (isStart) {
      this.ctx.beginPath();
      this.ctx.arc(node.x - this.nodeRadius + 6, node.y - this.nodeRadius + 6, 5, 0, 2 * Math.PI);
      this.ctx.fillStyle = '#ff5f56';
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    // Відстані
    if (node.dist !== undefined) {
      const distStr = node.dist === Infinity ? '∞' : node.dist.toString();
      this.ctx.font = 'bold 9px "Fira Code"';
      
      const badgeW = this.ctx.measureText(distStr).width + 8;
      const badgeH = 14;
      const badgeX = node.x - badgeW / 2;
      const badgeY = node.y - this.nodeRadius - 13;

      this.ctx.beginPath();
      this.ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
      this.ctx.fillStyle = isStart ? '#4f378b' : (node.dist === Infinity ? '#49454f' : '#1b5e20');
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText(distStr, node.x, badgeY + badgeH / 2);
    }
    
    this.ctx.restore();
  }

  drawEdge(edge) {
    const fromNode = this.nodes.find(n => n.id === edge.from);
    const toNode = this.nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return;
    
    this.ctx.save();
    
    let strokeColor = '#3a3447';
    let lineWidth = 2;
    let isDashed = false;

    if (edge.isActive) {
      strokeColor = '#d0bcff';
      lineWidth = 3;
    }
    
    if (edge.isRelaxing) {
      strokeColor = '#f9ab00';
      lineWidth = 3;
    }

    if (edge.isOptimal) {
      strokeColor = '#34d399';
      lineWidth = 4;
    }

    if (edge.isNegativeCycle) {
      strokeColor = '#f87171';
      lineWidth = 4;
      isDashed = true;
    }

    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    
    if (isDashed) {
      this.ctx.setLineDash([6, 4]);
    } else {
      this.ctx.setLineDash([]);
    }

    const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
    const startX = fromNode.x + this.nodeRadius * Math.cos(angle);
    const startY = fromNode.y + this.nodeRadius * Math.sin(angle);
    const endX = toNode.x - (this.nodeRadius + 6) * Math.cos(angle);
    const endY = toNode.y - (this.nodeRadius + 6) * Math.sin(angle);

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();

    // Стрілка
    this.ctx.fillStyle = strokeColor;
    this.ctx.beginPath();
    this.ctx.moveTo(endX, endY);
    
    const arrowLength = 9;
    const arrowAngle1 = angle - Math.PI / 6;
    const arrowAngle2 = angle + Math.PI / 6;
    
    this.ctx.lineTo(endX - arrowLength * Math.cos(arrowAngle1), endY - arrowLength * Math.sin(arrowAngle1));
    this.ctx.lineTo(endX - arrowLength * Math.cos(arrowAngle2), endY - arrowLength * Math.sin(arrowAngle2));
    this.ctx.closePath();
    this.ctx.fill();

    // Вага ребра
    const midX = (fromNode.x + toNode.x) / 2;
    const midY = (fromNode.y + toNode.y) / 2;
    
    const weightStr = edge.weight.toString();
    this.ctx.font = 'bold 9px "Fira Code"';
    
    const textW = this.ctx.measureText(weightStr).width + 8;
    const textH = 14;

    this.ctx.beginPath();
    this.ctx.roundRect(midX - textW / 2, midY - textH / 2, textW, textH, 4);
    
    if (edge.weight < 0) {
      this.ctx.fillStyle = 'rgba(248, 113, 113, 0.15)';
      this.ctx.strokeStyle = '#f87171';
      this.ctx.lineWidth = 1;
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.fillStyle = '#f87171';
    } else {
      this.ctx.fillStyle = '#17151e';
      this.ctx.strokeStyle = '#3a3447';
      this.ctx.lineWidth = 1;
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.fillStyle = '#b3afc1';
    }
    
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(weightStr, midX, midY);

    this.ctx.restore();
  }

  getSelectedAlgo() {
    const radio = document.querySelector(`input[name="select-algorithm-${this.suffix}"]:checked`);
    return radio ? radio.value : 'dijkstra';
  }

  prepareTrace() {
    if (this.nodes.length === 0) return false;
    if (!this.startNodeId) {
      this.startNodeId = this.nodes[0].id;
    }
    
    this.nodes.forEach(n => {
      n.dist = n.id === this.startNodeId ? 0 : Infinity;
      n.parent = null;
      n.isVisited = false;
      n.isActive = false;
      n.isProcessing = false;
    });
    this.edges.forEach(e => {
      e.isActive = false;
      e.isOptimal = false;
      e.isRelaxing = false;
      e.isNegativeCycle = false;
    });

    const algo = this.getSelectedAlgo();
    if (algo === 'dijkstra') {
      this.trace = generateDijkstraTrace(this.nodes, this.edges, this.startNodeId);
    } else {
      this.trace = generateBellmanFordTrace(this.nodes, this.edges, this.startNodeId);
    }
    
    this.stepIndex = 0;
    return true;
  }

  applyStep(index) {
    if (this.trace.length === 0 || index < 0 || index >= this.trace.length) return;
    const step = this.trace[index];
    
    this.nodes = JSON.parse(JSON.stringify(step.nodes));
    this.edges = JSON.parse(JSON.stringify(step.edges));
    this.draw();
    
    if (this.statusLog) {
      this.statusLog.textContent = step.msg;
      this.statusLog.className = `demo-log-alert ${step.statusType || 'success'}`;
    }
    
    // Оновлення таблиці
    if (this.stateTableBody) {
      this.stateTableBody.innerHTML = '';
      this.nodes.forEach(n => {
        const row = document.createElement('tr');
        if (n.isActive || n.isProcessing) row.classList.add('active-row');
        
        const parentNode = this.nodes.find(p => p.id === n.parent);
        const parentName = parentNode ? parentNode.name : '-';
        const distVal = n.dist === Infinity ? '∞' : n.dist;
        
        row.innerHTML = `<td><strong>${n.name}</strong></td><td>${distVal}</td><td>${parentName}</td>`;
        this.stateTableBody.appendChild(row);
      });
    }

    // Оновлення Дейкстри або Беллмана
    const algo = this.getSelectedAlgo();
    if (algo === 'dijkstra') {
      if (this.queueDisplay) {
        this.queueDisplay.innerHTML = '';
        if (step.queue) {
          step.queue.forEach((qItem, idx) => {
            const pill = document.createElement('div');
            pill.className = `queue-pill ${idx === 0 ? 'active' : ''}`;
            pill.innerHTML = `<span>${qItem.name}</span> <span style="font-size:0.65rem; opacity:0.8;">(${qItem.dist === Infinity ? '∞' : qItem.dist})</span>`;
            this.queueDisplay.appendChild(pill);
          });
        }
      }
    } else {
      const passInd = document.getElementById(`bf-pass-indicator-${this.suffix}`);
      const edgeInd = document.getElementById(`bf-edge-indicator-${this.suffix}`);
      if (passInd) passInd.textContent = step.passInfo || '-';
      if (edgeInd) edgeInd.textContent = step.edgeInfo || '-';
    }

    if (this.prevBtn) this.prevBtn.disabled = index === 0;
    if (this.nextBtn) this.nextBtn.disabled = index === this.trace.length - 1;
  }

  togglePlay() {
    if (this.timer) {
      this.stopSimulation();
    } else {
      if (this.trace.length === 0 || this.stepIndex === this.trace.length - 1) {
        if (!this.prepareTrace()) return;
      }
      
      this.playBtn.innerHTML = `<span class="material-symbols-outlined">pause</span><span>Призупинити</span>`;
      this.playBtn.classList.remove('btn-primary');
      this.playBtn.classList.add('btn-outline');
      
      const run = () => {
        this.applyStep(this.stepIndex);
        if (this.stepIndex < this.trace.length - 1) {
          this.stepIndex++;
          this.timer = setTimeout(run, parseInt(this.speedRange.value, 10));
        } else {
          this.stopSimulation();
        }
      };
      run();
    }
  }

  stepForward() {
    this.stopSimulation();
    if (this.trace.length === 0 || this.stepIndex === this.trace.length - 1) {
      if (!this.prepareTrace()) return;
    } else {
      this.stepIndex++;
    }
    this.applyStep(this.stepIndex);
  }

  stepBackward() {
    this.stopSimulation();
    if (this.stepIndex > 0) {
      this.stepIndex--;
      this.applyStep(this.stepIndex);
    }
  }

  stopSimulation() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.playBtn) {
      this.playBtn.innerHTML = `<span class="material-symbols-outlined">play_arrow</span><span>Запустити симуляцію</span>`;
      this.playBtn.classList.add('btn-primary');
      this.playBtn.classList.remove('btn-outline');
    }
  }

  resetSimulationState() {
    this.stopSimulation();
    this.trace = [];
    this.stepIndex = 0;
    
    this.nodes.forEach(n => {
      n.dist = undefined;
      n.parent = null;
      n.isVisited = false;
      n.isActive = false;
      n.isProcessing = false;
    });
    this.edges.forEach(e => {
      e.isActive = false;
      e.isOptimal = false;
      e.isRelaxing = false;
      e.isNegativeCycle = false;
    });
    
    this.draw();
    
    if (this.statusLog) {
      this.statusLog.textContent = 'Натисніть "Крок" або "Запустити" для перегляду кроків алгоритму.';
      this.statusLog.className = 'demo-log-alert';
    }
    if (this.stateTableBody) this.stateTableBody.innerHTML = '';
    if (this.queueDisplay) this.queueDisplay.innerHTML = '';
    
    const passInd = document.getElementById(`bf-pass-indicator-${this.suffix}`);
    const edgeInd = document.getElementById(`bf-edge-indicator-${this.suffix}`);
    if (passInd) passInd.textContent = '0 / V-1';
    if (edgeInd) edgeInd.textContent = '-';
    
    if (this.prevBtn) this.prevBtn.disabled = true;
    if (this.nextBtn) this.nextBtn.disabled = false;
  }
}

// Ініціалізація інстансів симуляції
function initSimulators() {
  // Симулятор для Слайда 6 (Дейкстра)
  window.visS6 = new GraphVisualizer('canvas-interactive-s6', 's6', 'simple');
  
  // Симулятор для Слайда 11 (Беллман-Форд та Дейкстра)
  window.visS11 = new GraphVisualizer('canvas-interactive-s11', 's11', 'negative');
  
  // Слухач перемикання алгоритму на Слайді 11
  const radiosS11 = document.getElementsByName('select-algorithm-s11');
  radiosS11.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('input[name="select-algorithm-s11"]').forEach(inp => {
        const parent = inp.closest('.algo-radio');
        if (parent) parent.classList.toggle('selected', inp.checked);
      });
      
      const isBF = radio.value === 'bellmanford';
      const bfDetails = document.getElementById('bf-details-box-s11');
      const qBox = document.getElementById('dijkstra-queue-box-s11');
      
      if (bfDetails) bfDetails.style.display = isBF ? 'block' : 'none';
      if (qBox) qBox.style.display = isBF ? 'none' : 'block';
      
      window.visS11.stopSimulation();
      window.visS11.resetSimulationState();
    });
  });
}


// ==========================================================================
// 4. ГЕНЕРАТОРИ ТРЕЙСІВ АЛГОРИТМІВ ТА ЗБІЛЬШЕННЯ БЛОК-СХЕМ
// ==========================================================================

const flowchartStates = {
  s5: { scale: 1, panX: 0, panY: 0, isDragging: false, startX: 0, startY: 0 },
  s10: { scale: 1, panX: 0, panY: 0, isDragging: false, startX: 0, startY: 0 }
};

window.zoomFlowchart = function(suffix, factor) {
  const state = flowchartStates[suffix];
  if (!state) return;
  state.scale = Math.max(0.3, Math.min(5, state.scale * factor));
  updateFlowchartTransform(suffix);
};

window.resetFlowchart = function(suffix) {
  const state = flowchartStates[suffix];
  if (!state) return;
  state.scale = 1;
  state.panX = 0;
  state.panY = 0;
  updateFlowchartTransform(suffix);
};

function updateFlowchartTransform(suffix) {
  const img = document.getElementById(`flowchart-img-${suffix}`);
  if (img) {
    const state = flowchartStates[suffix];
    img.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.scale})`;
  }
}

function initFlowchartPanAndZoom() {
  ['s5', 's10'].forEach(suffix => {
    const container = document.getElementById(`flowchart-container-${suffix}`);
    if (!container) return;
    const viewport = container.querySelector('.flowchart-viewport');
    const img = document.getElementById(`flowchart-img-${suffix}`);
    const state = flowchartStates[suffix];
    
    if (!viewport || !img) return;

    // Mouse events for panning
    viewport.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      state.isDragging = true;
      viewport.style.cursor = 'grabbing';
      state.startX = e.clientX - state.panX;
      state.startY = e.clientY - state.panY;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!state.isDragging) return;
      state.panX = e.clientX - state.startX;
      state.panY = e.clientY - state.startY;
      updateFlowchartTransform(suffix);
    });

    window.addEventListener('mouseup', () => {
      if (state.isDragging) {
        state.isDragging = false;
        viewport.style.cursor = 'grab';
      }
    });

    // Scroll wheel zoom
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      window.zoomFlowchart(suffix, zoomFactor);
    }, { passive: false });
  });
}

function generateDijkstraTrace(graphNodes, graphEdges, startNodeId) {
  let steps = [];
  let nodes = JSON.parse(JSON.stringify(graphNodes));
  let edges = JSON.parse(JSON.stringify(graphEdges));
  
  nodes.forEach(n => {
    n.dist = n.id === startNodeId ? 0 : Infinity;
    n.parent = null;
    n.isVisited = false;
    n.isActive = false;
    n.isProcessing = false;
  });
  edges.forEach(e => {
    e.isActive = false;
    e.isOptimal = false;
    e.isRelaxing = false;
  });

  let q = nodes.map(n => ({ id: n.id, name: n.name, dist: n.dist }));
  q.sort((a, b) => a.dist - b.dist);
  
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
    msg: "Ініціалізація: d[start] = 0, всі інші d = ∞. Q містить всі вершини.",
    statusType: "success",
    queue: JSON.parse(JSON.stringify(q))
  });

  let visitedCount = 0;
  while (visitedCount < nodes.length) {
    let minNode = null;
    nodes.forEach(n => {
      if (!n.isVisited) {
        if (!minNode || n.dist < minNode.dist) {
          minNode = n;
        }
      }
    });

    if (!minNode || minNode.dist === Infinity) {
      steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        msg: "Всі досяжні вершини опрацьовані. Алгоритм Дейкстри завершено.",
        statusType: "success",
        queue: []
      });
      break;
    }

    minNode.isActive = true;
    q = nodes.filter(n => !n.isVisited).map(n => ({ id: n.id, name: n.name, dist: n.dist }));
    q.sort((a, b) => a.dist - b.dist);

    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      msg: `Обираємо невідвідану вершину ${minNode.name} з найменшою відстанню (d = ${minNode.dist}).`,
      statusType: "success",
      queue: JSON.parse(JSON.stringify(q))
    });

    minNode.isVisited = true;
    minNode.isActive = false;
    visitedCount++;

    let outgoing = edges.filter(e => e.from === minNode.id);
    for (let edge of outgoing) {
      let targetNode = nodes.find(n => n.id === edge.to);
      if (!targetNode || targetNode.isVisited) continue;

      edge.isRelaxing = true;
      targetNode.isProcessing = true;
      
      let alt = minNode.dist + edge.weight;
      let isShortest = alt < targetNode.dist;
      let msg = `Перевіряємо сусіда ${targetNode.name} через ребро з вагою ${edge.weight}. Новий шлях: ${minNode.dist} + ${edge.weight} = ${alt}.`;
      
      if (isShortest) {
        targetNode.dist = alt;
        targetNode.parent = minNode.id;
        edge.isActive = true;
        msg += ` Знайдено коротший шлях! Оновлюємо d[${targetNode.name}] = ${alt}, попередник = ${minNode.name}.`;
      } else {
        msg += ` Шлях до ${targetNode.name} через ${minNode.name} (${alt}) не є коротшим за існуючий d = ${targetNode.dist}.`;
      }

      q = nodes.filter(n => !n.isVisited).map(n => ({ id: n.id, name: n.name, dist: n.dist }));
      q.sort((a, b) => a.dist - b.dist);

      steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        msg: msg,
        statusType: isShortest ? "success" : "warning",
        queue: JSON.parse(JSON.stringify(q))
      });

      edge.isRelaxing = false;
      edge.isActive = isShortest;
      targetNode.isProcessing = false;
    }

    edges.forEach(e => {
      let toNode = nodes.find(n => n.id === e.to);
      if (toNode && toNode.parent === e.from && toNode.isVisited) {
        e.isOptimal = true;
        e.isActive = false;
      } else {
        e.isActive = false;
      }
    });

    q = nodes.filter(n => !n.isVisited).map(n => ({ id: n.id, name: n.name, dist: n.dist }));
    q.sort((a, b) => a.dist - b.dist);

    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      msg: `Вершину ${minNode.name} повністю опрацьовано та видалено з Q.`,
      statusType: "success",
      queue: JSON.parse(JSON.stringify(q))
    });
  }

  nodes.forEach(n => {
    n.isActive = false;
    n.isProcessing = false;
  });
  edges.forEach(e => {
    e.isActive = false;
    e.isRelaxing = false;
    let toNode = nodes.find(n => n.id === e.to);
    if (toNode && toNode.parent === e.from && toNode.dist !== Infinity) {
      e.isOptimal = true;
    }
  });

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
    msg: "Роботу алгоритму Дейкстри завершено. Знайдено всі найкоротші шляхи.",
    statusType: "success",
    queue: []
  });

  return steps;
}

function generateBellmanFordTrace(graphNodes, graphEdges, startNodeId) {
  let steps = [];
  let nodes = JSON.parse(JSON.stringify(graphNodes));
  let edges = JSON.parse(JSON.stringify(graphEdges));
  
  nodes.forEach(n => {
    n.dist = n.id === startNodeId ? 0 : Infinity;
    n.parent = null;
    n.isVisited = false;
    n.isActive = false;
    n.isProcessing = false;
  });
  edges.forEach(e => {
    e.isActive = false;
    e.isOptimal = false;
    e.isRelaxing = false;
    e.isNegativeCycle = false;
  });

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
    msg: "Ініціалізація: d[start] = 0, інші відстані d = ∞.",
    statusType: "success",
    passInfo: "0 / V-1",
    edgeInfo: "-"
  });

  const V = nodes.length;
  let changed = false;

  for (let i = 1; i <= V - 1; i++) {
    changed = false;
    for (let j = 0; j < edges.length; j++) {
      let edge = edges[j];
      let uNode = nodes.find(n => n.id === edge.from);
      let vNode = nodes.find(n => n.id === edge.to);
      
      if (!uNode || !vNode) continue;

      uNode.isActive = true;
      vNode.isProcessing = true;
      edge.isRelaxing = true;

      let alt = uNode.dist + edge.weight;
      let isUpdated = false;
      let msg = `Ітерація ${i}/${V-1}. Перевіряємо ребро ${uNode.name}->${vNode.name} з вагою ${edge.weight}.`;

      if (uNode.dist !== Infinity && alt < vNode.dist) {
        vNode.dist = alt;
        vNode.parent = uNode.id;
        edge.isActive = true;
        isUpdated = true;
        changed = true;
        msg += ` Релаксація успішна! Оновлюємо d[${vNode.name}] = ${alt}, попередник = ${uNode.name}.`;
      } else {
        if (uNode.dist === Infinity) {
          msg += ` Релаксація неможлива: вершина ${uNode.name} недосяжна (d = ∞).`;
        } else {
          msg += ` Шлях через ${uNode.name} (${uNode.dist} + ${edge.weight} = ${alt}) не коротший за існуючий d[${vNode.name}] = ${vNode.dist}.`;
        }
      }

      steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        msg: msg,
        statusType: isUpdated ? "success" : "info",
        passInfo: `${i} / ${V-1}`,
        edgeInfo: `${uNode.name} → ${vNode.name}`
      });

      uNode.isActive = false;
      vNode.isProcessing = false;
      edge.isRelaxing = false;
      edge.isActive = false;
    }

    if (!changed) {
      steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        msg: `На ітерації ${i} жодна відстань не змінилася. Достроково завершуємо релаксацію ребер.`,
        statusType: "success",
        passInfo: `${i} / ${V-1}`,
        edgeInfo: "Завершено"
      });
      break;
    }
  }

  let hasNegCycle = false;
  for (let j = 0; j < edges.length; j++) {
    let edge = edges[j];
    let uNode = nodes.find(n => n.id === edge.from);
    let vNode = nodes.find(n => n.id === edge.to);
    
    if (!uNode || !vNode) continue;

    edge.isRelaxing = true;
    uNode.isActive = true;
    vNode.isProcessing = true;

    if (uNode.dist !== Infinity && uNode.dist + edge.weight < vNode.dist) {
      hasNegCycle = true;
      edge.isNegativeCycle = true;
      vNode.dist = -Infinity;
      
      steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        msg: `УВАГА! Виявлено цикл від'ємної ваги через ребро ${uNode.name}->${vNode.name}! Шлях може нескінченно зменшуватися.`,
        statusType: "danger",
        passInfo: "Перевірка циклів",
        edgeInfo: `${uNode.name} → ${vNode.name}`
      });

      edge.isRelaxing = false;
      uNode.isActive = false;
      vNode.isProcessing = false;
      break;
    }

    edge.isRelaxing = false;
    uNode.isActive = false;
    vNode.isProcessing = false;
  }

  if (!hasNegCycle) {
    nodes.forEach(n => {
      n.isVisited = n.dist !== Infinity;
    });
    edges.forEach(e => {
      let toNode = nodes.find(n => n.id === e.to);
      if (toNode && toNode.parent === e.from && toNode.dist !== Infinity) {
        e.isOptimal = true;
      }
    });

    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      msg: "Релаксацію завершено. Циклів з від'ємною вагою не виявлено. Найкоротші шляхи знайдено.",
      statusType: "success",
      passInfo: "Завершено",
      edgeInfo: "-"
    });
  }

  return steps;
}
