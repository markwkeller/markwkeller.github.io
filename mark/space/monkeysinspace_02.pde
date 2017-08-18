/* @pjs preload="southpole_tiny.png,moon_small.png,moon_shadow.png,southpole_shadow.png,stars.png,scale.png,scale2.png"; */

double day = 0;
int timeStep = 1;
int timeStill = 0;

float earthDiameter;
float earthCenterX;
float earthCenterY;

float moonRadius;
float earthTheta;
PImage earth;
PImage earthShade;
PImage moon;
PImage moonShade;
PImage starBackground;
PImage scale, scale2;
boolean endMessage = false;

Monkey[] futureMonkeys;
Monkey[] pastMonkeys;
String[] table;


void setup() {
  size(1200, 500);
  loadData();
  earth = loadImage("southpole_tiny.png");
  earthShade = loadImage("southpole_shadow.png");
  moon = loadImage("moon_small.png");
  moonShade = loadImage("moon_shadow.png");
  starBackground = loadImage("stars.png");
  scale = loadImage("scale.png");
  scale2 = loadImage("scale2.png");
  earthDiameter = int(width/30);
  earthCenterX= width/12;
  earthCenterY= height/2;
  moonRadius = width/6;
  pastMonkeys = new Monkey[0];
  earthTheta = 0;
  strokeCap(SQUARE);
  smooth();
}

void draw() {
  changeTime();
  pushMatrix();
  translate(width/2, height/2);
  rotate(earthTheta / 365.242);
  image(starBackground, -750, -750);
  popMatrix();
  pushMatrix();
  translate(earthCenterX, earthCenterY);
  drawEarth();
  drawMonkey();
  drawPastTrails();
  drawMoon();
  popMatrix();
  drawScale();
}

void changeTime() {
  timeStep = timeStill*int(width*160000/pow(dist(earthCenterX, earthCenterY, mouseX, earthCenterY), 2.5));
  if (timeStep>80000) {
    timeStep=80000;
  }
  day += timeStep*.01/(2*PI);
  if ( day>73000 && endMessage == false) {
    endEverything();
  }
}


void drawEarth() {
  earthTheta += timeStep*.01;
  earthTheta = earthTheta%(730.484*PI);
  pushMatrix();
  rotate(earthTheta);
  image(earth, -(earthDiameter*.5), -(earthDiameter*.5));
  popMatrix();
  pushMatrix();
  rotate(earthTheta / 365.242);
  image(earthShade, -(earthDiameter*.5), -(earthDiameter*.5));
  popMatrix();
}


void drawMoon() {
  float x = moonRadius * cos((earthTheta/28.0955)-PI/2);
  float y = moonRadius * sin((earthTheta/28.0955)-PI/2);
  noStroke();
  fill(255);
  pushMatrix();
  translate(x, y);
  pushMatrix();
  rotate(earthTheta / 27.322);
  image(moon, -.136345*earthDiameter, -.136345*earthDiameter);
  popMatrix();
  pushMatrix();
  rotate(earthTheta / 365.242);
  image(moonShade, -.136345*earthDiameter, -.136345*earthDiameter);
  popMatrix();
  popMatrix();
}

void drawMonkey() {
  for (int i=futureMonkeys.length-1; i>=0; i--) {
    if (futureMonkeys[i].getDate() <= day) {
      pastMonkeys = (Monkey[]) append(pastMonkeys, futureMonkeys[i]);
      drawTrail(i);
      futureMonkeys = (Monkey[]) shorten(futureMonkeys);
    }
  }
}

void drawPastTrails() {
  for (int i =0; i<pastMonkeys.length; i++) {
    pastMonkeys[i].drawTrail();
  }
}

void drawTrail(int i) {
  float distance = futureMonkeys[i].getDistance()*moonRadius+earthDiameter/2;
  float diameter = futureMonkeys[i].getDiameter();
  float velocity = futureMonkeys[i].getVelocity();
  println(int((float)day/365)+" years, "+int((float)day%365)+" days from today, " + futureMonkeys[i].getNamey() + " will come " + int(distance/(moonRadius+earthDiameter/2)*100)/100 + " LD from Earth.");
  println("\tIt will be traveling "+int(velocity*1000)+" m/s with a diameter of "+int(diameter*1000)+" m.");
  double theta = random(.001, PI/2); //cannot have a value of 0
  float x = (distance) * cos((float)theta);//good
  float y = (distance) * sin((float)theta);//good
  float slope = -x/y;//goods
  float startY = float(height)/2;//good
  float startX = ((startY-y)/slope)+x;//good
  double deflection = theta - 4000/sq(distance) - 1/(200*diameter);
  float x2 = (distance) * cos((float)deflection);//good
  float y2 = (distance) * sin((float)deflection);//good
  float slope2 = -x2/y2;//good
  float endY = -float(height)/2;//good
  if (deflection%(2*PI)<(-PI/2)&&deflection%(2*PI)>(-3*PI/2)) {
    endY = -1*endY;
  }
  float endX = ((endY-y2)/slope2)+x2;//good
  noFill();
  stroke(255, 255, 255);
  line(startX, startY, x, y);
  line(endX, endY, x2, y2);
  arc(0, 0, distance*2, distance*2, (float)deflection, (float)theta);
  pastMonkeys[pastMonkeys.length-1].setCoordinates(x, y, x2, y2, startX, startY, endX, endY, theta, deflection);
}

void drawScale() {
  if (timeStill==0) {
    image(scale2, 0, 0);
  } else {
    image(scale, 0, 0);
  }
}

void loadData() {
  table = loadStrings("string.txt");  
  futureMonkeys = new Monkey[table.length];
  for (int i=0; i<table.length; i++) {
    String[] subTable = split(table[i], ",");
    String name = subTable[0];
    String dateString = subTable[1];
    int date = getDate(dateString);
    String[] list = split(subTable[2], "/");
    float distance = float(list[0]);
    list = split(subTable[3], "/");
    float minDistance = float(list[0]);
    float velocity = float(subTable[4]);
    float diameter = 3431.4632*pow(10, (-.2*float(subTable[7])));
    futureMonkeys[i] = new Monkey(name, date, distance, minDistance, velocity, diameter);
  }
  println("There are "+table.length+" space rocks coming within 5 LD of Earth before the year 2200.");
  println("Click to begin.");
}

int getDate(String dateString_) {
  String[] list = split(dateString_, " ");
  list = split(list[0], "-");
  int year = int(list[0])*365;
  String monthString = list[1];
  int month = 0;
  if (monthString.equals("Feb")==true) { 
    month = 31;
  } else if (monthString.equals("Mar")==true) { 
    month = 59;
  } else if (monthString.equals("Apr")==true) { 
    month = 90;
  } else if (monthString.equals("May")==true) { 
    month = 120;
  } else if (monthString.equals("Jun")==true) { 
    month = 151;
  } else if (monthString.equals("Jul")==true) { 
    month = 181;
  } else if (monthString.equals("Aug")==true) { 
    month = 212;
  } else if (monthString.equals("Sep")==true) { 
    month = 243;
  } else if (monthString.equals("Oct")==true) { 
    month = 273;
  } else if (monthString.equals("Nov")==true) { 
    month = 304;
  } else if (monthString.equals("Dec")==true) { 
    month = 334;
  }
  int day = int(list[2]);
  return day+month+year-735497;
}

void endEverything() {
  println("It is the year 2200.");
  endMessage = true;
}

void mouseClicked() {
  if (timeStill!=1) {
    timeStill=1;
  } else {
    timeStill=0;
  }
}

class Monkey {
  float distance, minDistance, velocity, diameter;
  int date;
  String name;
  float x, y, x2, y2, startX, startY, endX, endY;
  double theta, deflection;

  // create  the Monkey
  Monkey(String name_, int date_, float distance_, float minDistance_, float velocity_, float diameter_) {
    name = name_;
    date = date_;
    distance = distance_;
    minDistance = minDistance_;
    velocity = velocity_;
    diameter = diameter_;
  }


  float getDiameter() {
    return diameter;
  }

  float getVelocity() {
    return velocity;
  }

  float getMinDistance() {
    return minDistance;
  }

  float getDistance() {
    return distance;
  }

  int getDate() {
    return date;
  }

  String getNamey() {
    return name;
  }

  void setCoordinates(float x_, float y_, float x2_, float y2_, float startX_, float startY_, float endX_, float endY_, double theta_, double deflection_) {
    x=x_;
    y=y_;
    x2=x2_;
    y2=y2_;
    startX=startX_;
    startY=startY_;
    endX=endX_;
    endY=endY_;
    theta=theta_;
    deflection=deflection_;
  }

  void drawTrail() {
    smooth(8);
    int g = int(30 + velocity*4);
    stroke(255, g, 110, 150);
    strokeWeight(sq(diameter+0.7));
    noFill();
    line(startX, startY, x, y);
    line(endX, endY, x2, y2);
    arc(0, 0, (distance*moonRadius+earthDiameter/2)*2, (distance*moonRadius+earthDiameter/2)*2, (float)deflection, (float)theta);
  }
}


