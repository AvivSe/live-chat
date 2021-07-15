import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {gql, useMutation} from "@apollo/client";

const Container = styled.div`
  display: flex;

  button {
    margin-left: 10px;
  }
`

const USER_LOGIN = gql`
    mutation  login($loginDto: LoginDto!) {
        login(loginDto: $loginDto) {
            username,
            id,
            role
        }
    }
`

function Login({adminMode, setUser}) {
    const [value, setValue] = useState('');
    const [userLogin, {data,error}] = useMutation(USER_LOGIN);

    useEffect(function () {
        if(data && !error) {
            setUser(data.login)
        }
    }, [data,error]);

    function handleChange(e) {
        setValue(e.target.value);
    }

    async function handleSubmit() {
        try {
             const user = await userLogin({variables: {loginDto: {username: value, role: adminMode ? "Support" : "Customer"}}});
        } catch (e) {
            console.log("createUser error", e);
        }
    }

    function handleKeyPress(e) {
        if (e.charCode === 13) {
            handleSubmit();
        }
    }

    return <Container>
        <TextField
            label="Username"
            value={value}
            onChange={handleChange}
            variant="outlined"
            onKeyPress={handleKeyPress}
            color={'secondary'}
        />
        <Button color={"secondary"} variant={"contained"} disabled={value.length < 2} onClick={handleSubmit}>
            Sign In
        </Button>
    </Container>
}

export default Login;
