/* eslint-disable no-loop-func */
import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { foliageDots, roseDots } from './static';

const canvas = {
  width: 804,
  height: 804,
}
let dotsArrayTemp = [];
let dotsArrayToTransform = [];
const gridSize = 50;

function App() {
  const [ctx, setCtx] = useState(null);

 const drawCurve = (arr) => {
  const xArray = arr.map(obj => obj.x);
  const yArray = arr.map(obj => obj.y);
  const wArray = arr.map(obj => obj.w);

  // Метод кривих третього порядку, заданих у інженерному вигляді.
  const findCord = (arr, t) => {
      const [p0, p1, p2, p3] = arr;
      const [w0, w1, w2, w3] = wArray;
      const coef = 1 - t;
      return (
          (p0 * w0 * coef ** 3 +
              3 * w1 * t * coef ** 2 * p1 +
              3 * w2 * t ** 2 * coef * p2 +
              t ** 3 * p3 * w3) /
          (w0 * coef ** 3 +
              3 * w1 * t * coef ** 2 +
              3 * w2 * t ** 2 * coef +
              t ** 3 * w3)
      );
  };

  let temp = arr[0];

  for (let i = 0; i < 1; i += 0.01) {
      const x = findCord(xArray, i);
      const y = findCord(yArray, i);

      ctx.beginPath();
      drawLine(temp.x, temp.y, x, y);
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.closePath();

      temp = { x, y };
  }
};


const drawLine = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();

    ctx.stroke();
};

const drawGrid = (w = canvas.width, h = canvas.height, step = gridSize) => {
    ctx.beginPath();
    ctx.strokeStyle = "#434B4D";
    ctx.lineWidth = 0.3;
    for (let i = 0; i < w; i += step) {
        drawLine(i, 0, i, h);
    }
    for (let i = 0; i < h; i += step) {
        drawLine(0, i, w, i);
    }
    ctx.stroke();
    ctx.closePath();
};

useEffect(() => {
  if(ctx) {
    drawGrid()
  }
}, [ctx])

const clearCanvas = (grid = true) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(grid) {
      drawGrid()
    }
};

const drawAllCurve = (arr = dotsArrayTemp) => {
  arr.forEach(element => drawCurve(element));
};

const transform = () => {
  if (dotsArrayTemp.length === 0) dotsArrayTemp = foliageDots;
    if (dotsArrayToTransform.length === 0)
        dotsArrayToTransform = roseDots;

  const deltaArray = dotsArrayToTransform.map((element, index) => {
      return element.map((el, i) => {
          const x = el.x - dotsArrayTemp[index][i].x;
          const y = el.y - dotsArrayTemp[index][i].y;

          return { ...el, x, y };
      });
  });

  const addDelta = step => {
      return dotsArrayTemp.map((element, index) => {
          return element.map((el, i) => {
              const x = el.x + deltaArray[index][i].x / step;
              const y = el.y + deltaArray[index][i].y / step;

              return { ...el, x, y };
          });
      });
  };

  const count = 20;

  for (let i = 0; i < count; i++) {
      setTimeout(() => {
        clearCanvas();
        dotsArrayTemp = addDelta(count);
        dotsArrayTemp.forEach(element => drawCurve(element));
      }, 100 + 100 * i);
  }
};


  const onDrawFoliage = () => {
    const picture = localStorage.getItem("kek");
    if (picture) {
        const pictureArray = JSON.parse(picture);
        dotsArrayTemp = pictureArray;
        clearCanvas();
        drawAllCurve();
    } else {
        dotsArrayTemp = foliageDots;
        clearCanvas();
        drawAllCurve();
    }
  }

  const onDrawRose = () => {
    const picture = localStorage.getItem("rosa");
    if (picture) {
        const pictureArray = JSON.parse(picture);
        dotsArrayTemp = pictureArray;
        clearCanvas();
        drawAllCurve();
    } else {
        dotsArrayTemp = roseDots;
        clearCanvas();
        drawAllCurve();
    }
  }

  return (
    <div style={{textAlign: 'center'}}>
      <h2>Метод кривих третього порядку, заданих у інженерному вигляді</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas 
          ref={canvas => {
            if (canvas){
              const ctx = canvas.getContext('2d');
              setCtx(ctx);
            }
          }} width="800" height="800"></canvas>
        <div style={{ paddingLeft: '20px' }}>
          <div>Folliage</div>
          <Button onClick={() => onDrawFoliage()} style={{marginBottom: "20px"}} type="primary">Draw</Button>
          <br />
          <div>Rose</div>
          <Button onClick={() => onDrawRose()} type="primary">Draw</Button>
          <br />
          <Button style={{marginTop: '20px'}} onClick={() => transform()}>Transform</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
