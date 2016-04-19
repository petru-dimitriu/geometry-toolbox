/* Geometry.js
  Basic implementations of computational geometry functions
  in JavaScript

  by Petru Dimitriu
*/
    Point = function(x,y,color)
    {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      if (color === undefined)
        this.color = "#000000";
      else
        this.color = color;
    }

    Polar = function(r,phi)
    {
      this.r = r;
      this.phi = phi;
    }

    Segment = function(point1, point2, color)
    {
      this.point1 = new Point(point1.x,point1.y);
      this.point2 = new Point(point2.x,point2.y);
      if (color === undefined)
        this.color = "#000000";
      else
        this.color = color;
    }

    function eqfp(a, b)
    {
      var EPS = 0.0000000001;
      return Math.abs(a-b) < EPS;
    }

    function cartesianToPolar(p)
    {
      return new Polar(Math.sqrt(p.x*p.x+p.y*p.y),Math.atan2(p.y,p.x));
    }

    function polarToCartesian(p)
    {
      return new Point(p.r*Math.cos(p.phi),p.r*Math.sin(p.phi));
    }

    function sarrus(p1, p2, p3)
    {
      return p1.x*p2.y+p2.x*p3.y+p1.y*p3.x-p3.x*p2.y-p3.y*p1.x-p1.y*p2.x;
    }

    function pointInsideTriangle(p,p1,p2,p3)
    {
      var x =
        (sarrus(p,p1,p2) >= 0 ? 1 : 0) +
        (sarrus(p,p2,p3) >= 0 ? 1 : 0) +
        (sarrus(p,p3,p1) >= 0 ? 1 : 0);
      return (x==3 || x==0);
    }

    function comparePolar(a,b)
    {
        if (a.phi < b.phi)
            return -1;
        else if (a.phi == b.phi)
            if (a.r < b.r)
                return -1;
            else
                return 1;
        else
            return 1;
    }

  function arrayToPolar(array)
  {
    var ret = [];
    for (var i = 0; i < array.length; i++)
    {
      ret.push(cartesianToPolar(array[i]));
    }
    return ret;
  }

  function arrayToCartesian(array)
  {
    var ret = [];
    for (var i = 0; i < array.length; i++)
    {
      ret.push(polarToCartesian(array[i]));
    }
    return ret;
  }

  function circularNext(i,n)
  {
    return (i<n-1 ? i+1 : 0);
  }

  function circularPrev(i,n)
  {
    return (i>0 ? i-1 : n-1);
  }

  function moveOrigin(S, newOrigin)
  {
    for (var i=0;i<S.length;i++)
      S[i].x -= newOrigin.x,
      S[i].y -= newOrigin.y;
  }

  function convexHull(S)
  {
    var n = S.length;
    var i,j,k,l,xmin,p1,p2,p3,forward;
    P = [];
    xmin = S[0];

    for (i=1;i<S.length;i++)
    {
      if (S[i].x < xmin.x)
        xmin = S[i];
    }

    var X = new Point(S[0].x,S[0].y);
    var done = false;
    for (i=0;i<n && !done;i++)
      for (j=i+1;j<n && !done;j++)
        for (k=j+1;k<n && !done;k++)
          for (l=k+1;l<n && !done;l++)
            if (pointInsideTriangle(S[l],S[i],S[j],S[k]))
            {
              X = new Point(S[l].x, S[l].y);
              done = true;
              break;
            }

    moveOrigin(S,X);
    console.log(S);
    P = arrayToPolar(S);
    console.log(P);
    P.sort(comparePolar);
    S = arrayToCartesian(P);


    for (i=0;i<n;i++)
    {
      console.log(xmin.x + " " + xmin.y + "\n" + S[i].x + " " + S[i].y);
      if (eqfp(xmin.x,S[i].x) && eqfp(xmin.y,S[i].y))
        break;
    }

    do
    {
      p1 = S[i];
      p2 = S[circularNext(i,n)];
      p3 = S[circularNext(circularNext(i,n),n)];
      if (sarrus(p1,p2,p3) >= 0)
      {
        console.log("aici" + i);
        i = circularNext(i,n);
        forward = true;
      }
      else
      {
          console.log(S);
          S.splice(circularNext(i,n),1);
          n--;
          console.log(S);
          console.log("------------");
          i = circularPrev(i,n);
          forward = false;
      }
    } while (!(forward && eqfp(S[i].x,xmin.x) && eqfp(S[i].y,xmin.y)));

    console.log("Gata" + i);
    console.log(S[i]);
    console.log(xmin);

    X.x = -X.x;
    X.y = -X.y;
    moveOrigin(S,X);

    return S;
  }
