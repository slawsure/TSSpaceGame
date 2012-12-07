var Games;
(function (Games) {
    var Game = (function () {
        function Game(viewPortElementId) {
            this.viewPortHeight = 600;
            this.viewPortWidth = 800;
            this.viewPort = null;
            this.ship = null;
            this.rocket = null;
            this.aliens = null;
            this.viewPort = document.getElementById(viewPortElementId);
            this.InitiateDisplay();
            this.InitiateEventHandlers();
        }
        Game.KeyCodes = {
            LeftArrow: 37,
            RightArrow: 39,
            SpaceBar: 32
        };
        Game.prototype.InitiateDisplay = function () {
            this.viewPort.style.position = 'absolute';
            this.viewPort.style.width = this.viewPortWidth.toString() + 'px';
            this.viewPort.style.height = this.viewPortHeight.toString() + 'px';
            this.viewPort.style.left = ((document.documentElement.clientWidth - this.viewPortWidth) / 2).toString() + 'px';
            this.viewPort.style.top = ((document.documentElement.clientHeight - this.viewPortHeight) / 2).toString() + 'px';
            this.viewPort.style.backgroundColor = 'Black';
            this.ship = new Ship('Images/Ship.png', this.viewPort);
            this.ship.SetXPos(this.viewPortWidth / 2);
            this.ship.SetYPos(this.viewPortHeight - this.ship.image.height);
            this.rocket = new Rocket('Images/Rocket.png', this.viewPort);
            this.aliens = new Array();
            for(var indexY = 0; indexY < 2; indexY++) {
                for(var index = 0; index < 10; index++) {
                    var alien = new Alien('Images/Invader.png', this.viewPort);
                    alien.Start(Math.max((alien.width + 20) * index, 1), Math.max((alien.height + 15) * indexY, 1));
                    alien.currentDirection = Alien.Direction.Right;
                    this.aliens.push(alien);
                }
            }
        };
        Game.prototype.InitiateEventHandlers = function () {
            var _this = this;
            setInterval(function () {
                if(_this.rocket.active) {
                    _this.rocket.Move();
                }
                if(_this.rocket.active) {
                    var rocketRect = _this.rocket.image.getBoundingClientRect();
                    for(var index = 0; index < _this.aliens.length; index++) {
                        if(_this.aliens[index].active) {
                            var alienRect = _this.aliens[index].image.getBoundingClientRect();
                            if(!(rocketRect.right < alienRect.left || rocketRect.left > alienRect.right || rocketRect.bottom < alienRect.top || rocketRect.top > alienRect.bottom)) {
                                _this.aliens[index].Kill();
                                _this.rocket.Kill();
                            }
                        }
                    }
                }
            }, 1);
            setInterval(function () {
                for(var index = 0; index < _this.aliens.length; index++) {
                    if(_this.aliens[index].active) {
                        _this.aliens[index].Move();
                    }
                }
            }, 1);
            this.addEventListener(document, 'keydown', function (event) {
                var keyEvent = event;
                var keyCode = 0;
                if(keyEvent && keyEvent.keyCode) {
                    keyCode = keyEvent.keyCode;
                } else {
                    if(window.event && window.event.keyCode) {
                        keyCode = window.event.keyCode;
                    }
                }
                if(keyCode) {
                    switch(keyCode) {
                        case Game.KeyCodes.LeftArrow:
                        case Game.KeyCodes.RightArrow: {
                            _this.ship.Move(keyCode);
                            break;

                        }
                        case Game.KeyCodes.SpaceBar: {
                            if(_this.rocket.active) {
                                _this.rocket.Move();
                            } else {
                                _this.rocket.Start(_this.ship.posX + (_this.ship.width / 2), _this.ship.posY);
                            }
                            break;

                        }
                    }
                }
            });
        };
        Game.prototype.addEventListener = function (element, event, listener) {
            if(element.addEventListener) {
                element.addEventListener(event, listener);
            } else {
                if(element.attachEvent) {
                    element.attachEvent(event, listener);
                }
            }
        };
        return Game;
    })();
    Games.Game = Game;    
    var Ship = (function () {
        function Ship(imageURL, parentElement) {
            this.image = null;
            this.posX = 0;
            this.posY = 0;
            this.width = 0;
            this.height = 0;
            this.image = document.createElement('img');
            parentElement.appendChild(this.image);
            this.image.src = imageURL;
            this.image.style.position = 'absolute';
            this.image.style.zIndex = '1000';
            this.width = this.image.clientWidth;
            this.height = this.image.clientHeight;
        }
        Ship.prototype.SetXPos = function (posX) {
            this.posX = posX;
            this.image.style.posLeft = this.posX;
        };
        Ship.prototype.SetYPos = function (posY) {
            this.posY = posY;
            this.image.style.posTop = this.posY;
        };
        Ship.prototype.Move = function (direction) {
            if(direction == Game.KeyCodes.LeftArrow) {
                this.SetXPos(this.posX - 4);
            } else {
                if(direction == Game.KeyCodes.RightArrow) {
                    this.SetXPos(this.posX + 4);
                }
            }
        };
        return Ship;
    })();
    Games.Ship = Ship;    
    var Rocket = (function () {
        function Rocket(imageURL, parentElement) {
            this.image = null;
            this.posX = 0;
            this.posY = 0;
            this.width = 0;
            this.height = 0;
            this.active = false;
            this.image = document.createElement('img');
            parentElement.appendChild(this.image);
            this.image.src = imageURL;
            this.image.style.position = 'absolute';
            this.image.style.zIndex = '999';
            this.width = this.image.clientWidth;
            this.height = this.image.clientHeight;
            this.image.style.visibility = 'hidden';
        }
        Rocket.prototype.SetXPos = function (posX) {
            this.posX = posX;
            this.image.style.posLeft = this.posX;
        };
        Rocket.prototype.SetYPos = function (posY) {
            this.posY = posY;
            this.image.style.posTop = this.posY;
        };
        Rocket.prototype.Move = function () {
            if(this.active) {
                this.posY -= 2;
                if(this.posY <= 0) {
                    this.image.style.visibility = 'hidden';
                    this.active = false;
                } else {
                    this.image.style.posTop = this.posY;
                }
            }
        };
        Rocket.prototype.Start = function (posX, posY) {
            this.SetXPos(posX);
            this.SetYPos(posY);
            this.image.style.visibility = 'visible';
            this.active = true;
        };
        Rocket.prototype.Kill = function () {
            this.image.style.visibility = 'hidden';
            this.active = false;
        };
        return Rocket;
    })();
    Games.Rocket = Rocket;    
    var Alien = (function () {
        function Alien(imageURL, parentElement) {
            this.image = null;
            this.posX = 0;
            this.posY = 0;
            this.width = 0;
            this.height = 0;
            this.currentDirection = Alien.Direction.Right;
            this.active = false;
            this.image = document.createElement('img');
            parentElement.appendChild(this.image);
            this.image.src = imageURL;
            this.image.style.position = 'absolute';
            this.image.style.zIndex = '999';
            this.width = this.image.width;
            ; ;
            this.height = this.image.height;
        }
        Alien.Direction = {
            Left: 1,
            Right: 2
        };
        Alien.prototype.SetXPos = function (posX) {
            this.posX = posX;
            this.image.style.posLeft = this.posX;
        };
        Alien.prototype.SetYPos = function (posY) {
            this.posY = posY;
            this.image.style.posTop = this.posY;
        };
        Alien.prototype.Move = function () {
            if(this.active) {
                if(this.posX <= 0) {
                    this.currentDirection = Alien.Direction.Right;
                    this.SetYPos(this.posY + 10);
                } else {
                    if(this.posX + this.width >= this.image.parentElement.clientWidth) {
                        this.currentDirection = Alien.Direction.Left;
                        this.SetYPos(this.posY + 10);
                    }
                }
                if(this.currentDirection == Alien.Direction.Right) {
                    this.SetXPos(this.posX + 1);
                } else {
                    this.SetXPos(this.posX - 1);
                }
                this.image.style.posLeft = this.posX;
            }
        };
        Alien.prototype.Start = function (posX, posY) {
            this.SetXPos(posX);
            this.SetYPos(posY);
            this.image.style.visibility = 'visible';
            this.active = true;
        };
        Alien.prototype.Kill = function () {
            this.image.style.visibility = 'hidden';
            this.active = false;
        };
        return Alien;
    })();
    Games.Alien = Alien;    
})(Games || (Games = {}));

