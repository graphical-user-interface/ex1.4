import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Container, Paper, Checkbox, Button } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	paper: {
		margin: theme.spacing(2),
		padding: theme.spacing(2, 1),
		textAlign: "center",
		color: theme.palette.text.secondary
	},

	input: {
		height: 2
	},
	area: {
		width: "100%",
		height: 150,
		backgroundColor: "#ddd"
	},
	checkbox: {
		verticalAlign: "top"
	},
	text: {
		lineHeight: 2.5,
		textAlign: "left",
		paddingLeft: 10
	}
}))
export default function App() {
	const classes = useStyles()

	const [mouseDistance, setMouseDistance] = useState(0)
	const [mouseSpeed, setMouseSpeed] = useState(0)
	const [wheelDistance, setWheelDistance] = useState(0)
	const [wheelSpeed, setWheelSpeed] = useState(0)
	const [checked, setChecked] = useState({
		mouseDistance: true,
		mouseSpeed: true,
		wheelDistance: false,
		wheelSpeed: false
	})

	const handleCheck = (e) => {
		const value = e.target.checked
		const name = e.target.name
		setChecked({
			...checked,
			[name]: value
		})
	}

	const resetDistances = () => {
		setMouseDistance(0)
		setWheelDistance(0)
	}

	let previousEvent = false

	const makeVelocityCalculator = (e_init, e) => {
		let x = e_init.clientX,
			new_x,
			new_y,
			new_t,
			x_dist,
			y_dist,
			interval,
			distance,
			wheelDistance = e_init.deltaY,
			velocity,
			wheelVelocity,
			y = e_init.clientY,
			t
		if (e === false) {
			return 0
		}
		t = e.time
		new_x = e.clientX
		new_y = e.clientY
		new_t = Date.now()
		x_dist = new_x - x
		y_dist = new_y - y
		interval = new_t - t
		// update values:
		x = new_x
		y = new_y
		distance = Math.round(Math.sqrt(x_dist * x_dist + y_dist * y_dist))
		if (
			(interval !== 0 && isNaN(velocity)) ||
			(interval !== 0 && isNaN(wheelVelocity))
		) {
			velocity = Math.round((distance * 100) / interval)
			wheelVelocity = Math.abs(
				Math.round((wheelDistance * 100) / interval)
			)
		}

		return [distance, velocity, wheelDistance, wheelVelocity]
	}

	const handleMouse = (area) => {
		area.onmousemove = (e) => {
			e.time = Date.now()
			let res = makeVelocityCalculator(e, previousEvent)
			previousEvent = e
			if (res[0] !== undefined) {
				setMouseDistance(mouseDistance + res[0])
			}
			if (res[1] !== undefined) {
				setMouseSpeed(res[1])
			}
		}
	}
	const handleWheel = (area) => {
		area.onwheel = (e) => {
			e.time = Date.now()
			let res = makeVelocityCalculator(e, previousEvent)
			previousEvent = e
			if (res[2] !== undefined) {
				setWheelDistance(wheelDistance + res[2])
			}
			if (res[3] !== undefined) {
				setWheelSpeed(res[3])
			}
		}
	}

	useEffect(() => {
		const area = document.getElementById("area")

		handleMouse(area)
		handleWheel(area)
	}, [mouseDistance, wheelDistance])

	return (
		<div className={classes.root}>
			<Container maxWidth='sm'>
				<Grid container>
					<Grid item xs={12}>
						<Paper elevation={2} className={classes.paper}>
							<Grid container>
								<Grid item xs={8}>
									<Grid container>
										<Grid item xs={4}>
											&nbsp;
										</Grid>
										<Grid item xs={4}>
											Mouse
										</Grid>
										<Grid item xs={4}>
											Scroll wheel
										</Grid>
									</Grid>
									<Grid container>
										<Grid
											item
											xs={4}
											className={classes.text}>
											Distance
										</Grid>
										<Grid item xs={4}>
											<Checkbox
												inputProps={{
													"aria-label":
														"primary checkbox"
												}}
												name='mouseDistance'
												checked={checked.mouseDistance}
												className={classes.checkbox}
												onChange={handleCheck}
											/>
										</Grid>
										<Grid item xs={4}>
											<Checkbox
												inputProps={{
													"aria-label":
														"primary checkbox"
												}}
												name='wheelDistance'
												checked={checked.wheelDistance}
												className={classes.checkbox}
												onChange={handleCheck}
											/>
										</Grid>
									</Grid>
									<Grid container>
										<Grid
											item
											xs={4}
											className={classes.text}>
											Speed
										</Grid>
										<Grid item xs={4}>
											<Checkbox
												inputProps={{
													"aria-label":
														"primary checkbox"
												}}
												name='mouseSpeed'
												checked={checked.mouseSpeed}
												className={classes.checkbox}
												onChange={handleCheck}
											/>
										</Grid>
										<Grid item xs={4}>
											<Checkbox
												inputProps={{
													"aria-label":
														"primary checkbox"
												}}
												name='wheelSpeed'
												checked={checked.wheelSpeed}
												className={classes.checkbox}
												onChange={handleCheck}
											/>
										</Grid>
									</Grid>
									<Grid container>
										<Grid
											item
											xs={12}
											style={{
												textAlign: "left",
												padding: "0 10px"
											}}>
											{(checked.mouseDistance ||
												checked.mouseSpeed) &&
												`Mouse has move${
													checked.mouseDistance
														? ` ${mouseDistance} units`
														: ""
												}${
													checked.mouseSpeed
														? ` with average speed of ${mouseSpeed} units/s`
														: ""
												}. `}
											{(checked.wheelDistance ||
												checked.wheelSpeed) &&
												`Wheel has move${
													checked.wheelDistance
														? ` ${wheelDistance} units`
														: ""
												}${
													checked.wheelSpeed
														? ` with average speed of ${wheelSpeed} units/s`
														: ""
												}.`}
										</Grid>
									</Grid>
									<Grid container>
										<Grid
											item
											xs={12}
											style={{
												textAlign: "left",
												padding: "10px 10px 0"
											}}>
											<Button
												variant='contained'
												color='primary'
												onClick={resetDistances}>
												Reset distances
											</Button>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={4}>
									<Paper
										elevation={1}
										id='area'
										className={classes.area}></Paper>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</div>
	)
}
