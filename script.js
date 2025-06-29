class LinearFunctionGraph {
    constructor() {
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 첫 번째 함수 (y = ax + b)
        this.slope = 1;
        this.yIntercept = 0;
        
        // 두 번째 함수 (y = cx + d)
        this.slope2 = 1;
        this.yIntercept2 = 0;
        this.showSecondFunction = false;
        
        // 격자 크기 설정 (10단위)
        this.gridSize = 40; // 40픽셀당 10단위
        this.unitSize = 10; // 한 칸당 10단위
        
        // 함수식 표시 요소
        this.firstEquation = document.getElementById('firstEquation');
        this.secondEquation = document.getElementById('secondEquation');
        
        // 캔버스 크기 설정
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // 컨트롤 요소들
        this.initializeControls();
        this.setupEventListeners();

        // 초기 그래프 그리기
        this.drawGraph();
        this.updateEquations();
    }

    initializeControls() {
        // 첫 번째 함수 컨트롤
        this.slopeInput = document.getElementById('slope');
        this.yInterceptInput = document.getElementById('yIntercept');
        this.slopeValue = document.getElementById('slopeValue');
        this.yInterceptValue = document.getElementById('yInterceptValue');
        this.slopeNumberInput = document.getElementById('slopeInput');
        this.yInterceptNumberInput = document.getElementById('yInterceptInput');

        // 두 번째 함수 컨트롤
        this.addSecondFunctionBtn = document.getElementById('addSecondFunction');
        this.secondFunctionControls = document.getElementById('secondFunctionControls');
        this.slope2Input = document.getElementById('slope2');
        this.yIntercept2Input = document.getElementById('yIntercept2');
        this.slope2Value = document.getElementById('slope2Value');
        this.yIntercept2Value = document.getElementById('yIntercept2Value');
        this.slope2NumberInput = document.getElementById('slope2Input');
        this.yIntercept2NumberInput = document.getElementById('yIntercept2Input');

        // 교점 정보
        this.intersectionPoint = document.getElementById('intersectionPoint');
        this.intersectionX = document.getElementById('intersectionX');
        this.intersectionY = document.getElementById('intersectionY');
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.drawGraph();
    }

    setupEventListeners() {
        // 첫 번째 함수 이벤트
        this.slopeInput.addEventListener('input', (e) => {
            this.slope = parseFloat(e.target.value);
            this.updateValues(1);
        });

        this.yInterceptInput.addEventListener('input', (e) => {
            this.yIntercept = parseFloat(e.target.value);
            this.updateValues(1);
        });

        this.slopeNumberInput.addEventListener('input', (e) => {
            let value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                value = Math.max(-100, Math.min(100, value));
                this.slope = value;
                this.slopeInput.value = value;
                this.updateValues(1);
            }
        });

        this.yInterceptNumberInput.addEventListener('input', (e) => {
            let value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                value = Math.max(-1000, Math.min(1000, value));
                this.yIntercept = value;
                this.yInterceptInput.value = value;
                this.updateValues(1);
            }
        });

        // 두 번째 함수 이벤트
        this.addSecondFunctionBtn.addEventListener('click', () => {
            this.showSecondFunction = !this.showSecondFunction;
            this.secondFunctionControls.style.display = this.showSecondFunction ? 'block' : 'none';
            this.intersectionPoint.style.display = this.showSecondFunction ? 'block' : 'none';
            this.secondEquation.style.display = this.showSecondFunction ? 'block' : 'none';
            this.addSecondFunctionBtn.textContent = this.showSecondFunction ? '두 번째 함수 숨기기' : '두 번째 함수 추가하기';
            this.updateEquations();
            this.drawGraph();
        });

        this.slope2Input.addEventListener('input', (e) => {
            this.slope2 = parseFloat(e.target.value);
            this.updateValues(2);
        });

        this.yIntercept2Input.addEventListener('input', (e) => {
            this.yIntercept2 = parseFloat(e.target.value);
            this.updateValues(2);
        });

        this.slope2NumberInput.addEventListener('input', (e) => {
            let value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                value = Math.max(-100, Math.min(100, value));
                this.slope2 = value;
                this.slope2Input.value = value;
                this.updateValues(2);
            }
        });

        this.yIntercept2NumberInput.addEventListener('input', (e) => {
            let value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                value = Math.max(-1000, Math.min(1000, value));
                this.yIntercept2 = value;
                this.yIntercept2Input.value = value;
                this.updateValues(2);
            }
        });
    }

    updateValues(functionNumber) {
        if (functionNumber === 1) {
            this.slopeValue.textContent = this.slope;
            this.yInterceptValue.textContent = this.yIntercept;
            this.slopeNumberInput.value = this.slope;
            this.yInterceptNumberInput.value = this.yIntercept;
        } else {
            this.slope2Value.textContent = this.slope2;
            this.yIntercept2Value.textContent = this.yIntercept2;
            this.slope2NumberInput.value = this.slope2;
            this.yInterceptNumberInput.value = this.yIntercept2;
        }

        this.updateEquations();
        if (this.showSecondFunction) {
            this.calculateIntersection();
        }
        this.drawGraph();
    }

    updateEquations() {
        // 첫 번째 함수식 업데이트
        let equation1 = 'y = ';
        if (this.slope === 1) equation1 += 'x';
        else if (this.slope === -1) equation1 += '-x';
        else equation1 += `${this.slope}x`;
        
        if (this.yIntercept > 0) equation1 += ` + ${this.yIntercept}`;
        else if (this.yIntercept < 0) equation1 += ` - ${Math.abs(this.yIntercept)}`;
        
        this.firstEquation.textContent = equation1;

        // 두 번째 함수식 업데이트
        if (this.showSecondFunction) {
            let equation2 = 'y = ';
            if (this.slope2 === 1) equation2 += 'x';
            else if (this.slope2 === -1) equation2 += '-x';
            else equation2 += `${this.slope2}x`;
            
            if (this.yIntercept2 > 0) equation2 += ` + ${this.yIntercept2}`;
            else if (this.yIntercept2 < 0) equation2 += ` - ${Math.abs(this.yIntercept2)}`;
            
            this.secondEquation.textContent = equation2;
            this.secondEquation.style.display = 'block';
        } else {
            this.secondEquation.style.display = 'none';
        }
    }

    calculateIntersection() {
        // 두 직선의 교점 계산
        // y = ax + b
        // y = cx + d
        // ax + b = cx + d
        // (a-c)x = d-b
        // x = (d-b)/(a-c)
        if (this.slope !== this.slope2) {
            const x = (this.yIntercept2 - this.yIntercept) / (this.slope - this.slope2);
            const y = this.slope * x + this.yIntercept;
            this.intersectionX.textContent = x.toFixed(2);
            this.intersectionY.textContent = y.toFixed(2);
        } else {
            this.intersectionX.textContent = "없음";
            this.intersectionY.textContent = "없음";
        }
    }

    drawArrow(fromX, fromY, toX, toY) {
        const headLength = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        
        this.ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.stroke();
    }

    drawGrid() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        const xAxisCenter = Math.floor(height / 2);
        const yAxisCenter = Math.floor(width / 2);

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;

        // 수직선 그리기
        for (let x = yAxisCenter % this.gridSize; x < width; x += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();

            // 눈금 숫자 표시 (x축)
            if (Math.abs(x - yAxisCenter) > 1) {
                const value = Math.round((x - yAxisCenter) / this.gridSize * this.unitSize);
                ctx.fillStyle = '#666';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(value.toString(), x, xAxisCenter + 20);
            }
        }

        // 수평선 그리기
        for (let y = xAxisCenter % this.gridSize; y < height; y += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();

            // 눈금 숫자 표시 (y축)
            if (Math.abs(y - xAxisCenter) > 1) {
                const value = Math.round((xAxisCenter - y) / this.gridSize * this.unitSize);
                ctx.fillStyle = '#666';
                ctx.font = '12px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(value.toString(), yAxisCenter - 10, y + 4);
            }
        }

        // x축과 y축 그리기
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // x축
        ctx.beginPath();
        ctx.moveTo(0, xAxisCenter);
        ctx.lineTo(width - 20, xAxisCenter);
        ctx.stroke();
        this.drawArrow(width - 20, xAxisCenter, width, xAxisCenter);

        // y축
        ctx.beginPath();
        ctx.moveTo(yAxisCenter, height);
        ctx.lineTo(yAxisCenter, 20);
        ctx.stroke();
        this.drawArrow(yAxisCenter, 20, yAxisCenter, 0);

        // 원점 표시
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('O', yAxisCenter - 5, xAxisCenter + 15);
    }

    drawFunction(slope, yIntercept, color) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // 좌표계 중심점
        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        // 그래프 그리기
        for (let pixelX = 0; pixelX < width; pixelX++) {
            // 픽셀 좌표를 실제 좌표로 변환
            const x = (pixelX - centerX) / this.gridSize * this.unitSize;
            // y = ax + b 계산
            const y = slope * x + yIntercept;
            // 실제 좌표를 픽셀 좌표로 변환
            const pixelY = centerY - (y / this.unitSize * this.gridSize);

            if (pixelX === 0) {
                ctx.moveTo(pixelX, pixelY);
            } else {
                ctx.lineTo(pixelX, pixelY);
            }
        }
        ctx.stroke();

        // 교점 표시
        if (this.showSecondFunction && color === '#ff0000') {
            const intersectionX = parseFloat(this.intersectionX.textContent);
            const intersectionY = parseFloat(this.intersectionY.textContent);
            
            if (!isNaN(intersectionX) && !isNaN(intersectionY)) {
                const pixelX = centerX + (intersectionX * this.gridSize / this.unitSize);
                const pixelY = centerY - (intersectionY * this.gridSize / this.unitSize);
                
                // 교점 점 그리기
                ctx.beginPath();
                ctx.arc(pixelX, pixelY, 5, 0, Math.PI * 2);
                ctx.fillStyle = '#000';
                ctx.fill();

                // 교점 좌표 텍스트 그리기
                ctx.font = '14px Arial';
                ctx.fillStyle = '#000';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';
                ctx.fillText(`(${intersectionX.toFixed(1)}, ${intersectionY.toFixed(1)})`, 
                    pixelX + 10, pixelY - 5);
            }
        }
    }

    drawGraph() {
        // 캔버스 초기화
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 격자 그리기
        this.drawGrid();
        
        // 첫 번째 함수 그래프 그리기
        this.drawFunction(this.slope, this.yIntercept, '#ff0000');

        // 두 번째 함수 그래프 그리기
        if (this.showSecondFunction) {
            this.drawFunction(this.slope2, this.yIntercept2, '#0000ff');
        }
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new LinearFunctionGraph();
}); 