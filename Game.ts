module Games
{
	export class Game
	{
		private static KeyCodes = { LeftArrow: 37, RightArrow: 39, SpaceBar: 32 };

		private viewPortHeight: number = 600;
		private viewPortWidth: number = 800;

		private viewPort: HTMLDivElement = null;

		private ship: Ship = null;
		private rocket: Rocket = null;
		private aliens: Alien[] = null;

		constructor (viewPortElementId : string)
		{
			this.viewPort = <HTMLDivElement>document.getElementById(viewPortElementId);

			this.InitiateDisplay();
			this.InitiateEventHandlers();
		}

		private InitiateDisplay()
		{
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
			for (var indexY = 0; indexY < 2; indexY++)
			{
				for (var index = 0; index < 10; index++)
				{
					var alien: Alien = new Alien('Images/Invader.png', this.viewPort);
					alien.Start(Math.max((alien.width + 20) * index, 1), Math.max((alien.height + 15) * indexY, 1));
					alien.currentDirection = Alien.Direction.Right;
					this.aliens.push(alien);
				}
			}
		}

		private InitiateEventHandlers()
		{
			setInterval(function () => 
			{ 
				if (this.rocket.active) 
					this.rocket.Move();

				if (this.rocket.active)
				{
					var rocketRect: ClientRect = this.rocket.image.getBoundingClientRect();

					for (var index = 0; index < this.aliens.length; index++)
					{
						if (this.aliens[index].active)
						{
							var alienRect: ClientRect = this.aliens[index].image.getBoundingClientRect();
							if (!(rocketRect.right < alienRect.left || rocketRect.left > alienRect.right || rocketRect.bottom < alienRect.top || rocketRect.top > alienRect.bottom))
							{
								this.aliens[index].Kill();
								this.rocket.Kill();
							}
						}
					}
				}

			}, 1);

			setInterval(function () => 
			{ 
				for (var index = 0; index < this.aliens.length; index++)
					if (this.aliens[index].active)
						this.aliens[index].Move();
			}, 1);

            this.addEventListener(document, 'keydown', (event) => 
			{
                var keyEvent: KeyboardEvent = <KeyboardEvent>event;
                var keyCode: number = 0;
				if (keyEvent && keyEvent.keyCode)
					keyCode = keyEvent.keyCode;
				else if (window.event && window.event.keyCode)
					keyCode = window.event.keyCode;

				if (keyCode)
				{
					switch (keyCode)
					{
						case Game.KeyCodes.LeftArrow:
						case Game.KeyCodes.RightArrow:

							this.ship.Move(keyCode);

							break;

						case Game.KeyCodes.SpaceBar:

							if (this.rocket.active)
								this.rocket.Move();
							else
								this.rocket.Start(this.ship.posX + (this.ship.width / 2), this.ship.posY);

							break;
					}
				}
			});
		}

		private addEventListener(element : any, event: string, listener: EventListener)
		{
			if (element.addEventListener)
				element.addEventListener(event, listener);
			else if (element.attachEvent)
				element.attachEvent(event, listener);
		}

	}

	export class Ship
	{
		public image: HTMLImageElement = null;

		public posX: number = 0;
		public posY: number = 0;
		public width: number = 0;
		public height: number = 0;

		constructor (imageURL: string, parentElement: HTMLElement)
		{
			this.image = <HTMLImageElement>document.createElement('img');
			parentElement.appendChild(this.image);
			this.image.src = imageURL;
			this.image.style.position = 'absolute';
			this.image.style.zIndex = '1000';
			this.width = this.image.clientWidth;
			this.height = this.image.clientHeight;
		}

		public SetXPos(posX: number)
		{
			this.posX = posX;
			this.image.style.posLeft = this.posX;
		} 

		public SetYPos(posY: number)
		{
			this.posY = posY;
			this.image.style.posTop = this.posY;
		}

		public Move(direction: number)
		{
			if (direction == Game.KeyCodes.LeftArrow)
			{
				this.SetXPos(this.posX - 4);
				//if (this.imageShip.style.left
			}
			else if (direction == Game.KeyCodes.RightArrow)
				this.SetXPos(this.posX + 4);
		}
	}

	export class Rocket
	{
		public image: HTMLImageElement = null;

		public posX: number = 0;
		public posY: number = 0;
		public width: number = 0;
		public height: number = 0;

		public active: bool = false;

		constructor (imageURL: string, parentElement: HTMLElement)
		{
			this.image = <HTMLImageElement>document.createElement('img');
			parentElement.appendChild(this.image);
			this.image.src = imageURL;
			this.image.style.position = 'absolute';
			this.image.style.zIndex = '999';
			this.width = this.image.clientWidth;
			this.height = this.image.clientHeight;
			this.image.style.visibility = 'hidden';
		}

		public SetXPos(posX: number)
		{
			this.posX = posX;
			this.image.style.posLeft = this.posX;
		} 

		public SetYPos(posY: number)
		{
			this.posY = posY;
			this.image.style.posTop = this.posY;
		}

		public Move()
		{
			if (this.active)
			{
				this.posY-=2;

				if (this.posY <= 0)
				{
					this.image.style.visibility = 'hidden';
					this.active = false;
				}
				else
					this.image.style.posTop = this.posY;
			}			
		}

		public Start(posX: number, posY: number)
		{
			this.SetXPos(posX);
			this.SetYPos(posY);

			this.image.style.visibility = 'visible';
			this.active = true;
		}

		public Kill()
		{
			this.image.style.visibility = 'hidden';
			this.active = false;
		}

	}

	export class Alien
	{
		public image: HTMLImageElement = null;

		public posX: number = 0;
		public posY: number = 0;
		public width: number = 0;
		public height: number = 0;

		private static Direction = { Left: 1, Right: 2};

		public currentDirection: number = Alien.Direction.Right;

		public active: bool = false;

		constructor (imageURL: string, parentElement: HTMLElement)
		{
			this.image = <HTMLImageElement>document.createElement('img');
			parentElement.appendChild(this.image);
			this.image.src = imageURL;
			this.image.style.position = 'absolute';
			this.image.style.zIndex = '999';
			this.width = this.image.width;;
			this.height = this.image.height;
		}

		public SetXPos(posX: number)
		{
			this.posX = posX;
			this.image.style.posLeft = this.posX;
		} 

		public SetYPos(posY: number)
		{
			this.posY = posY;
			this.image.style.posTop = this.posY;
		}

		public Move()
		{
			if (this.active)
			{
				if (this.posX <= 0)
				{
					this.currentDirection = Alien.Direction.Right;
					this.SetYPos(this.posY + 10);
				}
				else if (this.posX + this.width >= this.image.parentElement.clientWidth)
				{
					this.currentDirection = Alien.Direction.Left;
					this.SetYPos(this.posY + 10);
				}
			
				if (this.currentDirection == Alien.Direction.Right)
					this.SetXPos(this.posX + 1);
				else
					this.SetXPos(this.posX - 1);
					
				this.image.style.posLeft = this.posX;
			}			
		}

		public Start(posX: number, posY: number)
		{
			this.SetXPos(posX);
			this.SetYPos(posY);

			this.image.style.visibility = 'visible';
			this.active = true;
		}

		public Kill()
		{
			this.image.style.visibility = 'hidden';
			this.active = false;
		}
	}

}